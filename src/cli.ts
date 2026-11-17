#!/usr/bin/env node

import chalk from 'chalk';

import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_SKILLS_DIR = path.resolve(__dirname, '../skills');
const TARGET_SKILLS_DIR = path.resolve(process.cwd(), '.claude/skills');

async function getAvailableSkills(): Promise<string[]> {
  try {
    const entries = await fs.readdir(SOURCE_SKILLS_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch {
    console.error(chalk.red('\n✖ Failed to locate bundled skills directory.'));
    process.exit(1);
  }
}

async function promptConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input, output });

  try {
    while (true) {
      const answer = await rl.question(question);
      const normalized = answer.trim().toLowerCase();

      if (normalized === 'y' || normalized === 'yes') {
        return true;
      }
      if (normalized === 'n' || normalized === 'no') {
        return false;
      }

      console.log(chalk.yellow('  Please enter Y or N.'));
    }
  } finally {
    rl.close();
  }
}

async function installSkills(skills: string[]): Promise<void> {
  await fs.mkdir(TARGET_SKILLS_DIR, { recursive: true });

  for (const skill of skills) {
    const srcPath = path.join(SOURCE_SKILLS_DIR, skill);
    const destPath = path.join(TARGET_SKILLS_DIR, skill);

    await fs.rm(destPath, { recursive: true, force: true });
    await fs.cp(srcPath, destPath, { recursive: true });
    console.log(`${chalk.green('  ✔')} Installed ${chalk.cyan(skill)}`);
  }
}

async function main(): Promise<void> {
  console.log(chalk.bold.blue('\nFrontend Agent Skills Installer\n'));

  const skills = await getAvailableSkills();

  if (skills.length === 0) {
    console.log(chalk.yellow('No skills found to install.'));
    process.exit(0);
  }

  console.log(chalk.white('Target directory: ') + chalk.dim(TARGET_SKILLS_DIR));
  console.log(chalk.white('\nThe following skills will be installed:\n'));

  for (const skill of skills) {
    console.log(`  ${chalk.gray('•')} ${chalk.cyan(skill)}`);
  }

  console.log('');

  const confirmed = await promptConfirmation(
    chalk.bold('Proceed with installation? (Y/N): ')
  );

  if (!confirmed) {
    console.log(chalk.yellow('\nInstallation cancelled. No files were modified.\n'));
    process.exit(0);
  }

  console.log('');
  await installSkills(skills);

  console.log(
    chalk.bold.green(`\n✔ Successfully installed ${skills.length} skills into .claude/skills/\n`)
  );
}

main().catch((err: unknown) => {
  console.error(chalk.red('\n✖ Unexpected error during installation:'), err);
  process.exit(1);
});