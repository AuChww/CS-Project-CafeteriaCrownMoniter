"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [usernameDecoded, setUsernameDecoded] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (token) {
            try {
                const decoded = decodeJWT(token);
                setUser({
                    userId: decoded.user_id,
                    username: decoded.username,
                    role: decoded.role
                });
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);


    // useEffect(() => {
    //     // รับ token จาก localStorage เมื่อเริ่มต้น
    //     const token = localStorage.getItem("token");

    //     // หากมี token ให้ถอดรหัสและเก็บข้อมูลผู้ใช้
    //     if (token) {
    //         try {
    //             const decoded = decodeJWT(token);
    //             setUsernameDecoded(decoded.username);
    //             setUserId(decoded.user_id);
    //             setRole(decoded.role);
    //         } catch (error) {
    //             console.error("Error decoding token:", error);
    //         }
    //     }
    // }, [usernameDecoded,userId,role]);

    // ฟังก์ชันสำหรับถอดรหัส JWT
    // ฟังก์ชันสำหรับถอดรหัส JWT
    const decodeJWT = (token) => {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) {
                throw new Error("Invalid token structure");
            }
    
            const payloadBase64 = parts[1];
    
            // ถอด base64 จาก URL-safe encoding
            const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    
            // แก้ไขเพื่อใช้ double quotes แทน single quotes
            const correctedPayloadJson = payloadJson.replace(/'/g, '"');
    
            // ตรวจสอบว่า payload เป็น JSON ที่ถูกต้องหรือไม่
            try {
                const parsedPayload = JSON.parse(correctedPayloadJson);
                return parsedPayload;
            } catch (parseError) {
                console.error("Error parsing payload:", parseError);
                console.error("Decoded payload:", correctedPayloadJson);  // แสดงค่าที่ถอดรหัสมาเพื่อการดีบัก
                return null;
            }
        } catch (error) {
            console.error("Invalid token format or content:", error);
            return null;
        }
    };
       

    const login = (token) => {
        const decodedUser = decodeJWT(token); // ถอดรหัส JWT
        if (decodedUser) {
            setUser(decodedUser); // เก็บข้อมูลผู้ใช้
            localStorage.setItem("token", token); // เก็บ token ใน localStorage
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token"); // ลบ token เมื่อออกจากระบบ
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
