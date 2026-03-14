import {useRouter} from "expo-router";
import {ArrowRight, Wallet} from "lucide-react-native";
import React from "react";
import {Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
// import {Link} from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import React, {useEffect, useState} from "react";
// import {Image, Text, TouchableOpacity, View} from "react-native";
// import {SafeAreaView} from "react-native-safe-area-context";

const {width, height} = Dimensions.get("window");

const Welcome = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Subtle diamond/crosshatch pattern overlay */}
            <View style={styles.patternOverlay} pointerEvents="none">
                {Array.from({length: 20}).map((_, row) =>
                    Array.from({length: 12}).map((_, col) => (
                        <View
                            key={`${row}-${col}`}
                            style={[
                                styles.diamond,
                                {
                                    top: row * 44 - 10,
                                    left: col * 34 + (row % 2 === 0 ? 0 : 17),
                                },
                            ]}
                        />
                    ))
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Wallet size={48} color="#1a3a1a" strokeWidth={2} />
                </View>

                {/* App Name */}
                <Text style={styles.appName}>Sika</Text>

                {/* Tagline */}
                <Text style={styles.tagline}>Your money. Your intelligence.</Text>

                {/* Feature Icons */}
                <View style={styles.featuresRow}>
                    {/* SMS Sync */}
                    <View style={styles.featureItem}>
                        <View style={styles.featureIconContainer}>
                            <View style={styles.smsIcon}>
                                <View style={styles.smsLine1} />
                                <View style={styles.smsLine2} />
                                <View style={styles.smsBubbleTail} />
                            </View>
                        </View>
                        <Text style={styles.featureLabel}>SMS Sync</Text>
                    </View>

                    {/* Insights */}
                    <View style={styles.featureItem}>
                        <View style={styles.featureIconContainer}>
                            <View style={styles.pieIcon}>
                                <View style={styles.pieSlice1} />
                                <View style={styles.pieSlice2} />
                                <View style={styles.pieDot} />
                            </View>
                        </View>
                        <Text style={styles.featureLabel}>Insights</Text>
                    </View>

                    {/* Goals */}
                    <View style={styles.featureItem}>
                        <View style={styles.featureIconContainer}>
                            <View style={styles.targetOuter}>
                                <View style={styles.targetMiddle}>
                                    <View style={styles.targetInner} />
                                </View>
                            </View>
                        </View>
                        <Text style={styles.featureLabel}>Goals</Text>
                    </View>
                </View>
            </View>

            {/* Get Started Button */}
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.85}
                    onPress={() => router.push("/(auth)/signup")}
                >
                    <View style={{flexDirection: "row", alignItems: "center", gap: 8}}>
                        <Text style={styles.buttonText}>Get Started</Text>
                        <ArrowRight size={20} color="#1a1a1a" strokeWidth={2.5} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const GREEN_DARK = "#1a4d2e";
const GREEN_MID = "#1e5c35";
const YELLOW = "#f5c518";
const YELLOW_LIGHT = "#ffd94a";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GREEN_DARK,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 60,
        overflow: "hidden",
    },
    patternOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.06,
    },
    diamond: {
        position: "absolute",
        width: 22,
        height: 22,
        borderWidth: 1,
        borderColor: WHITE,
        transform: [{rotate: "45deg"}],
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingHorizontal: 32,
    },

    // Logo
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 28,
        backgroundColor: YELLOW,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        shadowColor: YELLOW,
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 12,
    },
    logoInner: {
        alignItems: "center",
        justifyContent: "center",
    },
    walletBody: {
        width: 48,
        height: 36,
        borderWidth: 3,
        borderColor: "#1a3a1a",
        borderRadius: 6,
        backgroundColor: "transparent",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: 4,
    },
    walletFlap: {
        position: "absolute",
        top: -10,
        left: 4,
        right: 4,
        height: 12,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: "#1a3a1a",
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    walletCoin: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 3,
        borderColor: "#1a3a1a",
        backgroundColor: "transparent",
    },

    // Text
    appName: {
        fontSize: 48,
        fontWeight: "800",
        color: WHITE,
        letterSpacing: 1,
        marginTop: 8,
    },
    tagline: {
        fontSize: 16,
        color: YELLOW,
        fontWeight: "600",
        letterSpacing: 0.3,
        marginBottom: 32,
    },

    // Features
    featuresRow: {
        flexDirection: "row",
        gap: 28,
        marginTop: 8,
    },
    featureItem: {
        alignItems: "center",
        gap: 8,
    },
    featureIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: "rgba(245,197,24,0.35)",
        backgroundColor: "rgba(245,197,24,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    featureLabel: {
        color: WHITE,
        fontSize: 12,
        fontWeight: "500",
        opacity: 0.85,
    },

    // SMS Icon
    smsIcon: {
        width: 28,
        height: 24,
        borderWidth: 2,
        borderColor: YELLOW,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
    },
    smsLine1: {
        width: 16,
        height: 2,
        backgroundColor: YELLOW,
        borderRadius: 1,
    },
    smsLine2: {
        width: 12,
        height: 2,
        backgroundColor: YELLOW,
        borderRadius: 1,
    },
    smsBubbleTail: {
        position: "absolute",
        bottom: -6,
        left: 4,
        width: 6,
        height: 6,
        backgroundColor: GREEN_DARK,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: YELLOW,
        transform: [{rotate: "45deg"}],
    },

    // Pie Icon
    pieIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: YELLOW,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    pieSlice1: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 14,
        height: 14,
        backgroundColor: YELLOW,
    },
    pieSlice2: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 8,
        height: 14,
        backgroundColor: "rgba(245,197,24,0.4)",
    },
    pieDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: GREEN_DARK,
        zIndex: 2,
    },

    // Target/Goals Icon
    targetOuter: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: YELLOW,
        alignItems: "center",
        justifyContent: "center",
    },
    targetMiddle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: YELLOW,
        alignItems: "center",
        justifyContent: "center",
    },
    targetInner: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: YELLOW,
    },

    // Button
    bottomSection: {
        width: "100%",
        paddingHorizontal: 32,
    },
    button: {
        backgroundColor: YELLOW,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: "center",
        shadowColor: YELLOW,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    buttonText: {
        color: "#1a1a1a",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});

export default Welcome;
