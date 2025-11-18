# -*- coding: utf-8 -*-
{
    'name': 'ELearning',
    'category': 'Theme',
    'version': '18.0.1.0.0',
    'sequence': 1,
    'author': 'XAPP',
    'summary': """Unlock the full potential of your eLearning platform with this modern, fully customizable Odoo website theme—designed exclusively for online academies, coaching centers, instructors, corporate training providers, and digital learning platforms.
                  With a clean UI, intuitive course layout system, and student-friendly experience, this theme makes it effortless to build a professional learning website that boosts engagement and reflects your brand identity.
                   """,

    'description': """
       E-Learning - eLearning Website Theme for Odoo 18

      A powerful, elegant, and fully responsive eLearning website theme crafted for online education providers,
tutors, training institutes, coaching platforms, and professional learning businesses.

       Support:
       -
       For any questions or support, please contact.
   """,
    'license': 'OPL-1',
    'support': 'teamxapp.dev@gmail.com',
    'price': 49.11,
    'currency': 'USD',

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
        'static/description/elearning_cover.gif',
        'static/description/elearning_screenshot.gif',

    ],
    
    'live_test_url': 'http://13.60.52.65:8071',
    'installable': True,
    'auto_install': False,
    'application': False,
}
