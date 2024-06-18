const levels = [
    {
        level: 0,
        xp_total: 0,
        days: 77
    },
    {
        level: 1,
        xp_total: 462,
        days: 59
    },
    {
        level: 2,
        xp_total: 2688,
        days: 71
    },
    {
        level: 3,
        xp_total: 5885,
        days: 55
    },
    {
        level: 4,
        xp_total: 11777,
        days: 68
    },
    {
        level: 5,
        xp_total: 29217,
        days: 127
    },
    {
        level: 6,
        xp_total: 46255,
        days: 87
    },
    {
        level: 7,
        xp_total: 63559,
        days: 17
    },
    {
        level: 8,
        xp_total: 74349,
        days: 0
    },
    {
        level: 9,
        xp_total: 85490,
        days: 0
    },
    {
        level: 10,
        xp_total: 95000,
        days: 0
    },
    {
        level: 11,
        xp_total: 105630,
        days: 0
    },
    {
        level: 12,
        xp_total: 124446,
        days: 0
    }
]

const projects = [
    {
        id: 1314,
        name: "Libft",
        rank: 0,
        xp: 462,
        maxGrade: 125
    },
    {
        id: 1327,
        name: "get_next_line",
        rank: 1,
        xp: 882,
        maxGrade: 125
    },
    {
        id: 1316,
        name: "ft_printf",
        rank: 1,
        xp: 882,
        maxGrade: 125
    },
    {
        id: 1994,
        name: "Born2beroot",
        rank: 1,
        xp: 577,
        maxGrade: 125
    },
    {
        id: 1471,
        name: "push_swap",
        rank: 2,
        xp: 1855,
        maxGrade: 125
    },
    {
        id: 2005,
        name: "minitalk",
        rank: 2,
        xp: 1142,
        maxGrade: 125,
        group: 1,
    },
    {
        id: 2004,
        name: "pipex",
        rank: 2,
        xp: 1142,
        maxGrade: 125,
        group: 1,
    },
    {
        id: 2009,
        name: "so_long",
        rank: 2,
        xp: 1000,
        maxGrade: 125,
        group: 2,
    },
    {
        id: 1476,
        name: "fract-ol",
        rank: 2,
        xp: 1000,
        maxGrade: 125,
        group: 2,
    },
    {
        id: 2008,
        name: "fdf",
        rank: 2,
        xp: 1000,
        maxGrade: 125,
        group: 2,
    },
    {
        id: 1334,
        name: "Philosophers",
        rank: 3,
        xp: 3360,
        maxGrade: 125
    },
    {
        id: 1331,
        name: "minishell",
        rank: 3,
        xp: 2814,
        maxGrade: 125
    },
    {
        id: 1326,
        name: "Cub3D",
        rank: 4,
        xp: 5775,
        maxGrade: 125,
        group: 1,
    },
    {
        id: 1315,
        name: "miniRT",
        rank: 4,
        xp: 5775,
        maxGrade: 125,
        group: 1,
    },
    {
        id: 2007,
        name: "NetPractice",
        rank: 4,
        xp: 3160,
        maxGrade: 100
    },
    {
        id: 2364,
        name: "Piscine CPP",
        rank: 4,
        xp: 9660,
        maxGrade: 100
    },
    {
        id: 1335,
        name: "ft_containers",
        rank: 5,
        xp: 10042,
        maxGrade: 125
    },
    {
        id: 1983,
        name: "Inception",
        rank: 5,
        xp: 10042,
        maxGrade: 125
    },
    {
        id: 1332,
        name: "webserv",
        rank: 5,
        xp: 21630,
        maxGrade: 125
    },
    {
        id: 1336,
        name: "ft_irc",
        rank: 5,
        xp: 21630,
        maxGrade: 125
    },
    {
        id: 1337,
        name: "ft_transcendence",
        rank: 6,
        xp: 24360,
        maxGrade: 100
    },
]

const projectsUserDb = [
    {
        id: 0,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 1,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 2,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 3,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 4,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 5,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 6,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 7,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 8,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 9,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 10,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 11,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 12,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 13,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 14,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
    {
        id: 15,
        start_date: "",
        finish_date: "",
        gained_bh_days: 0,
        gained_xp: 0,
        score: 0,
    },
]

module.exports = { levels, projects, projectsUserDb };
