"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
    children,
}:{
    children:React.ReactNode
}){

    const router=useRouter();

    const user=true;
    // later from context/store/api

    useEffect(()=>{

        if(!user){
            router.push("/login");
        }

    },[user,router])

    if(!user){

        return <p>Checking authentication...</p>

    }

    return <>{children}</>
}