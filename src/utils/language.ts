import {
    type SupportedLanguage,
    SUPPORTED_LANGUAGES,
    LANGUAGE_CONFIG,
    LANGUAGE_REGION_MAP,
    langToLocaleMap,
} from "@i18n/language";
import {
    siteConfig,
} from "@/config";


// 重新导出以保持向后兼容
export { SUPPORTED_LANGUAGES, type SupportedLanguage, LANGUAGE_CONFIG, LANGUAGE_REGION_MAP, langToLocaleMap };


// 语言存储键
const LANG_STORAGE_KEY = "selected-language";

// 存储语言设置
export function setStoredLanguage(lang: string): void {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
}

// 获取存储的语言设置
export function getStoredLanguage(): string | null {
    if (typeof localStorage !== "undefined") {
        return localStorage.getItem(LANG_STORAGE_KEY);
    }
    return null;
}

// 获取默认语言配置
export function getDefaultLanguage(): string {
    const fallback = siteConfig.lang;
    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return configCarrier?.dataset.lang || fallback;
    }
    return fallback;
}

// 归一化语言代码：统一转为小写并把 "-" 换成 "_"（例如 zh-CN → zh_cn）
function normalizeLangCode(code: string): string {
    return code.trim().toLowerCase().replace(/-/g, "_");
}

/**
 * 解析语言代码为 SupportedLanguage。
 * 依次尝试：精确匹配 → 归一化后匹配 → LANGUAGE_REGION_MAP 地区变体（例如 zh_cn → zh_hans）
 * → 主语言代码匹配（例如 zh_cn_tw → zh_cn → zh_hans）
 */
export function resolveSupportedLang(code: string): SupportedLanguage | undefined {
    if (!code) return undefined;
    if (SUPPORTED_LANGUAGES.includes(code as SupportedLanguage)) {
        return code as SupportedLanguage;
    }
    const normalized = normalizeLangCode(code);
    if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
        return normalized as SupportedLanguage;
    }
    if (normalized in LANGUAGE_REGION_MAP) {
        return LANGUAGE_REGION_MAP[normalized];
    }
    const primaryCode = normalized.split("_")[0];
    if (primaryCode && primaryCode in LANGUAGE_REGION_MAP) {
        return LANGUAGE_REGION_MAP[primaryCode];
    }
    return undefined;
}

// 获取解析后的站点语言代码
export function getResolvedSiteLang(): SupportedLanguage {
    const configLang = getDefaultLanguage();
    const resolved = resolveSupportedLang(configLang);
    if (resolved) return resolved;
    // 如果 siteConfig.lang 不合规，则使用浏览器检测到的语言
    return detectBrowserLanguage();
}

// 获取语言的显示名称
export function getLanguageDisplayName(langCode: string): string {
    if (!langCode) return langCode;
    // 先尝试作为配置语言代码查找
    if (langCode in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[langCode as SupportedLanguage].displayName;
    }
    // 再尝试按地区变体解析（例如 zh_CN → zh_hans）
    const resolved = resolveSupportedLang(langCode);
    if (resolved) {
        return LANGUAGE_CONFIG[resolved].displayName;
    }
    // 如果都找不到，返回原始代码
    return langCode;
}

// 检测浏览器语言并返回支持的语言代码
export function detectBrowserLanguage(fallbackLang: SupportedLanguage = "en"): SupportedLanguage {
    // 服务端渲染时返回备用语言
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return fallbackLang;
    }
    // 获取浏览器语言列表
    const browserLangs = navigator.languages || [navigator.language];
    // 遍历浏览器语言列表，找到第一个支持的语言
    for (const browserLang of browserLangs) {
        // 支持完整 BCP 47 标签（例如 zh-CN）与主语言代码（例如 zh）两种匹配方式
        const resolved = resolveSupportedLang(browserLang);
        if (resolved) return resolved;
    }
    // 如果没有找到支持的语言，返回备用语言
    return fallbackLang;
}
