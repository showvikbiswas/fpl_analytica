import random
import string

def generate_code(N):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(N))
