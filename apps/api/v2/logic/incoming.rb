# apps/api/v2/logic/incoming.rb

require_relative 'base'

module V2::Logic
  module Incoming

    class CreateIncoming < V2::Logic::Base
      attr_reader :passphrase, :secret_value, :ticketno, :incoming_config
      attr_reader :metadata, :secret, :recipient, :ttl, :enabled
      attr_accessor :token

      def process_settings
        super()
        @incoming_config = OT.conf.dig(:features, :incoming) || {enabled: false}
        @enabled = incoming_config[:enabled]

        # We set recipient here since it's based on configuration and not params
        @recipient = incoming_config[:email]
      end

      def process_params
        @ttl = 7.days
        @secret_value = params[:secret]
        @ticketno = params[:ticketno].to_s.strip
        @passphrase = incoming_config[:passphrase].to_s.strip
      end

      def raise_concerns
        raise_form_error "Invalid email address" unless valid_email?(recipient)

        if secret_value.to_s.empty?
          raise_form_error "You did not provide any information to share"
        end

        limit_action :create_secret
        limit_action :email_recipient

        regex = Regexp.new(incoming_config[:regex] || '\A[a-zA-Z0-9]{1,32}\z')
        if ticketno.to_s.empty? || !ticketno.match(regex)
          raise_form_error "You must provide a valid ticket number"
        end
      end

      def process
        @metadata, @secret = V2::Secret.spawn_pair cust.custid, token
        if !passphrase.empty?
          secret.update_passphrase passphrase
          metadata.passphrase = secret.passphrase
        end
        secret.encrypt_value secret_value, :size => plan.options[:size]
        metadata.ttl, secret.ttl = ttl, ttl
        metadata.secret_shortkey = secret.shortkey
        secret.save
        metadata.save
        if metadata.valid? && secret.valid?
          unless cust.anonymous?
            cust.add_metadata metadata
            cust.increment :secrets_created
          end
          V2::Customer.global.increment :secrets_created
          unless recipient.nil? || recipient.empty?
            metadata.deliver_by_email cust, locale, secret, recipient.first, Onetime::Mail::IncomingSupport, ticketno
          end
          V2::Logic.stathat_count("Secrets", 1)
        else
          raise_form_error "Could not store your secret"
        end
      end
    end

  end
end
