# -*- coding: utf-8 -*-
{
    'name': 'ELearning',
    'category': 'Theme',
    'version': '18.0.1.0.0',
    'sequence': 1,
    'depends': [
        'website',
        'web_editor',
    ],

    'data': [
        'views/hero_section.xml',
        'views/about_us.xml',
        'views/course_hero.xml',
        'views/contact_hero.xml',
        'views/blog.xml',
        'views/blog2.xml',
        'views/blog3.xml',
        'views/blog4.xml',
        'views/blog5.xml',
        'views/blog6.xml',
        'views/map.xml',
        'views/elearning_testimonials.xml',
        'views/elearning_team.xml',
        'views/eleraning_courses_categories.xml',
        'views/elearning_about.xml',
        'views/elearning_courses.xml',
        'views/elearning_sub_content.xml',
        'views/elearning_snippets.xml',
    ],

    'assets': {
        'web.assets_frontend': [
            'theme_elearning/static/src/css/header.css',
            'theme_elearning/static/src/css/banner.css',
            'theme_elearning/static/src/css/product.css',
            'theme_elearning/static/src/css/shop.css',
            'theme_elearning/static/src/css/cart.css',
            'theme_elearning/static/src/css/myhome.css',
            'theme_elearning/static/src/css/checkout.css',
            'theme_elearning/static/src/js/header.js',
        ],
    },

'images': [
        'static/description/eLearning_landscapes.gif',
        'static/description/elearning_protriates.gif',

    ],


    'installable': True,
    'auto_install': False,
    'application': False,
}
