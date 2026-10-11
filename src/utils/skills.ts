// Skill data configuration file
// Used to manage data for the skill display page
const skillModules = import.meta.glob('../content/skills/*.json', { eager: true });

export interface Skill {
    id: string;
    name: string;
    description: string;
    icon: string; // Iconify icon name
    category: "ai" | "backend" | "client" | "frontend" | "database" | "engines" | "tools" | "others";
    level: "beginner" | "intermediate" | "advanced" | "expert";
    /**
     * 使用年限（可选）。没有真实数据时**不要填**，
     * 页面会自动隐藏这一项，而不是显示 0 年。
     */
    experience?: {
        years: number;
        months: number;
    };
    projects?: string[]; // Related project IDs
    certifications?: string[];
    color?: string; // Skill card theme color
    basePath?: string;
}

export const skillsData: Skill[] = Object.entries(skillModules).map(([path, mod]: [string, any]) => {
  const id = path.split('/').pop()?.replace('.json', '') || '';
  const data = mod.default;
  const basePath = path.replace('../', '').replace(/\/[^/]+$/, '');
  return { id, ...data, basePath } as Skill;
});

// Get skill statistics
export const getSkillStats = () => {
    const total = skillsData.length;
    const byLevel = {
        beginner: skillsData.filter((s) => s.level === "beginner").length,
        intermediate: skillsData.filter((s) => s.level === "intermediate").length,
        advanced: skillsData.filter((s) => s.level === "advanced").length,
        expert: skillsData.filter((s) => s.level === "expert").length,
    };
    const byCategory = {
        ai: skillsData.filter((s) => s.category === "ai").length,
        backend: skillsData.filter((s) => s.category === "backend").length,
        client: skillsData.filter((s) => s.category === "client").length,
        frontend: skillsData.filter((s) => s.category === "frontend").length,
        database: skillsData.filter((s) => s.category === "database").length,
        tools: skillsData.filter((s) => s.category === "tools").length,
        engines: skillsData.filter((s) => s.category === "engines").length,
        others: skillsData.filter((s) => s.category === "others").length,
    };
    return { total, byLevel, byCategory };
};


// Get skills by category
export const getSkillsByCategory = (category?: string) => {
    if (!category || category === "all") {
        return skillsData;
    }
    return skillsData.filter((s) => s.category === category);
};


// Get advanced skills
export const getAdvancedSkills = () => {
    return skillsData.filter(
        (s) => s.level === "advanced" || s.level === "expert",
    );
};


// Calculate total years of experience（只统计填了 experience 的技能）
export const getTotalExperience = () => {
    const totalMonths = skillsData.reduce((total, skill) => {
        if (!skill.experience) return total;
        return total + skill.experience.years * 12 + skill.experience.months;
    }, 0);
    return {
        years: Math.floor(totalMonths / 12),
        months: totalMonths % 12,
        /** 是否至少有一项技能填了使用年限 */
        hasData: skillsData.some((s) => !!s.experience),
    };
};