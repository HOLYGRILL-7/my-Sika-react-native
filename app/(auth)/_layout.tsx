import {Stack} from "expo-router";
import React from "react";

const AuthLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{headerShown: false}} />
        </Stack>
    );
};

export default AuthLayout;
