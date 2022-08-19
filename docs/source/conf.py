# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))
import pydata_sphinx_theme


# -- Project information -----------------------------------------------------

project = 'NI4AI Blog'
copyright = '2021, PingThings'
author = 'PingThings'

# The full version, including alpha/beta/rc tags
release = '0.1'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = ['nbsphinx', 'sphinxcontrib.email', 'IPython.sphinxext.ipython_console_highlighting'
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['**.ipynb_checkpoints']


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'pydata_sphinx_theme'
html_logo = "_static/PingThings_logo_color.png"
html_favicon = '_static/tree.ico'

html_theme_options = {
    "external_links": [
        {"url": "https://btrdb.readthedocs.io/en/latest/", "name": "API Docs"},
        # {"url": "https://github.com/PingThingsIO/ni4ai-notebooks/", "name": "Github"},
        {"url": "https://www.pingthings.io/", "name": "PingThings"},
    ],
    "github_url": "https://github.com/PingThingsIO/ni4ai-notebooks",
    # "youtube_url": "https://www.youtube.com/watch?v=qRAPYVtC2zM&list=PLqSksWmTnkQ64OW0zreAvMIYefARkfrdT",
    "favicons": [{"rel": "icon", "sizes": "16x16", "href": "_static/tree.png"}
    ],

    "icon_links": [
        {
            "name": "PingThings",
            "url": "https://www.pingthings.io/",
            "icon": "fa",
        }
    ],
    # "use_edit_page_button": True,
    # "show_toc_level": 1,
    # "show_nav_level": 2,
    # "search_bar_position": "navbar",  # TODO: Deprecated - remove in future version
    # "navbar_align": "left",  # [left, content, right] For testing that the navbar items align properly
    # "navbar_start": ["navbar-logo", "navbar-version"],
    # "navbar_center": ["navbar-nav", "navbar-version"],  # Just for testing
    # "navbar_end": ["navbar-icon-links", "navbar-version"]  # Just for testing
    # "footer_items": ["copyright", "sphinx-version", ""]
}


# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']


# Obfuscate email addresses
email_automode = True


master_doc = 'index'
