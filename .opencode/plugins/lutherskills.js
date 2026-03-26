/**
 * LutherSkills plugin for Claude Code
 *
 * Auto-registers skills directory via config hook.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const LutherSkillsPlugin = async ({ client, directory }) => {
  const lutherskillsSkillsDir = path.resolve(__dirname, '../../skills');

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(lutherskillsSkillsDir)) {
        config.skills.paths.push(lutherskillsSkillsDir);
      }
    }
  };
};
