// tests/unit/vue/components/SecretContentInputArea.spec.ts

import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SecretContentInputArea from '@/components/secrets/form/SecretContentInputArea.vue';
import { createI18n } from 'vue-i18n';

// Mock i18n
const i18n = createI18n({
  messages: {
    en: {
      web: {
        COMMON: {
          secret_placeholder: 'Enter your secret message',
        },
      },
    },
  },
  locale: 'en',
});

describe('SecretContentInputArea', () => {
  const defaultProps = {
    maxLength: 10000,
    withDomainDropdown: false,
  };

  const mountComponent = (props = {}) => {
    return mount(SecretContentInputArea, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [i18n],
      },
    });
  };

  describe('Textarea Functionality', () => {
    it('renders textarea with correct initial state', () => {
      const wrapper = mountComponent();
      const textarea = wrapper.find('textarea');

      expect(textarea.exists()).toBe(true);
      expect(textarea.attributes('maxlength')).toBe('10000');
      expect(textarea.attributes('autofocus')).toBeDefined();
    });

    it('handles content input and enforces maxLength', async () => {
      const maxLength = 10;
      const wrapper = mountComponent({ maxLength });
      const textarea = wrapper.find('textarea');

      await textarea.setValue('12345678901'); // 11 characters

      expect(wrapper.emitted('update:content')?.[0][0]).toHaveLength(maxLength);
      expect(textarea.element.value).toHaveLength(maxLength);
    });

    it('emits content updates', async () => {
      const wrapper = mountComponent();
      const textarea = wrapper.find('textarea');
      const testContent = 'test content';

      await textarea.setValue(testContent);

      expect(wrapper.emitted('update:content')).toBeTruthy();
      expect(wrapper.emitted('update:content')?.[0][0]).toBe(testContent);
    });
  });

  describe('Character Counter', () => {
    it('shows character counter on hover', async () => {
      const wrapper = mountComponent();

      await wrapper.trigger('mouseenter');

      const counter = wrapper.find('.pointer-events-none');
      expect(counter.exists()).toBe(true);
    });

    it('formats character count correctly', async () => {
      const wrapper = mountComponent();
      const textarea = wrapper.find('textarea');

      await textarea.setValue('1234567890');
      await wrapper.trigger('mouseenter');

      const counter = wrapper.find('.pointer-events-none');
      expect(counter.text()).toContain('10 / 10,000');
    });
  });

  describe('Domain Dropdown', () => {
    const domains = ['domain1.com', 'domain2.com'];

    it('renders domain dropdown when enabled', () => {
      const wrapper = mountComponent({
        withDomainDropdown: true,
        availableDomains: domains,
      });

      const dropdown = wrapper.find('[role="menu"]');
      expect(dropdown.exists()).toBe(true);
    });

    it('emits selected domain', async () => {
      const wrapper = mountComponent({
        withDomainDropdown: true,
        availableDomains: domains,
      });

      // Open dropdown
      await wrapper.find('button').trigger('click');

      // Select first domain
      const domainOption = wrapper.find('[role="menuitem"]');
      await domainOption.trigger('click');

      expect(wrapper.emitted('update:selected-domain')?.[0][0]).toBe(domains[0]);
    });

    it('closes dropdown on outside click', async () => {
      const wrapper = mountComponent({
        withDomainDropdown: true,
        availableDomains: domains,
      });

      // Open dropdown
      await wrapper.find('button').trigger('click');

      // Simulate click outside
      const event = new Event('click');
      document.dispatchEvent(event);

      await wrapper.vm.$nextTick();

      const dropdown = wrapper.find('[role="menu"]');
      expect(dropdown.exists()).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('has proper aria labels', () => {
      const wrapper = mountComponent();
      const textarea = wrapper.find('textarea');

      expect(textarea.attributes('aria-label')).toBe('Enter the secret content to share here');
    });

    it('maintains proper tab order', () => {
      const wrapper = mountComponent({
        withDomainDropdown: true,
        availableDomains: ['domain1.com'],
      });

      const focusableElements = wrapper.findAll('textarea, button, [role="menuitem"]');

      expect(focusableElements.length).toBeGreaterThan(0);
      focusableElements.forEach((el) => {
        expect(el.attributes('tabindex')).toBeDefined;
      });
    });
  });
});
