# Just makes this folder a module.

import os

directory = os.path.dirname(__file__)
lib = os.path.join(directory, 'lib')
site = os.path.join(directory, 'site')