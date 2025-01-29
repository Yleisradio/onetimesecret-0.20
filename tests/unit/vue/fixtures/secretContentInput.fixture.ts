import { readFileSync } from "fs";
import { join } from "path";

export const INPUT_MARKDOWN = readFileSync(
  join(__dirname, 'secretContentInput.md'),
  'utf8'
);
