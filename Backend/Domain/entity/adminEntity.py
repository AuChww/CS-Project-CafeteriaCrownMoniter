from dataclasses import dataclass

@dataclass
class Admin:
    admin_id: int
    admin_image: str
    username: str
    password: str
    email: str
