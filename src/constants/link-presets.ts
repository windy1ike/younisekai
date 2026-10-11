import { LinkPreset, type NavbarLink } from "@/types/config";
import { i18n } from "@i18n/translation";
import I18nKey from "@i18n/i18nKey";


export const LinkPresets: { [key in LinkPreset]: NavbarLink } = {
    [LinkPreset.Home]: {
        name: i18n(I18nKey.home),
        url: "/",
        icon: "material-symbols:home",
        description: "younisekai 主页，记录异世界的每一次落笔。",
    },
    [LinkPreset.Archive]: {
        name: i18n(I18nKey.archive),
        url: "/archive/",
        icon: "material-symbols:archive",
        description: "按时间排列的全部文章归档。",
    },
    [LinkPreset.Projects]: {
        name: i18n(I18nKey.projects),
        url: "/projects/",
        icon: "material-symbols:work",
        description: i18n(I18nKey.projectsSubtitle),
    },
    [LinkPreset.Skills]: {
        name: i18n(I18nKey.skills),
        url: "/skills/",
        icon: "material-symbols:psychology",
        description: i18n(I18nKey.skillsSubtitle),
    },
    [LinkPreset.Timeline]: {
        name: i18n(I18nKey.timeline),
        url: "/timeline/",
        icon: "material-symbols:timeline",
        description: i18n(I18nKey.timelineSubtitle),
    },
    [LinkPreset.Diary]: {
        name: i18n(I18nKey.diary),
        url: "/diary/",
        icon: "material-symbols:book",
        description: i18n(I18nKey.diarySubtitle),
    },
    [LinkPreset.Albums]: {
        name: i18n(I18nKey.albums),
        url: "/albums/",
        icon: "material-symbols:photo-library",
        description: i18n(I18nKey.albumsSubtitle),
    },
    [LinkPreset.Friends]: {
        name: i18n(I18nKey.friends),
        url: "/friends/",
        icon: "material-symbols:group",
        description: "一路同行的朋友们。",
    },
    [LinkPreset.About]: {
        name: i18n(I18nKey.about),
        url: "/about/",
        icon: "material-symbols:info",
        description: "关于 younisekai 与这个站点。",
    },
};
