import jwt from "jsonwebtoken";
import { parseCookies } from "nookies";

export default function Profile() {
    const { token } = parseCookies();
    const user = token ? jwt.decode(token) : null;

    if (!user) return <p>Unauthorized</p>;

    return (
        <div>
            <h1>Hello, {user.username}!</h1>
            <p>Role: {user.role}</p>
        </div>
    );
}
