import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
} from "react-native";
import axios from "axios";


const GrammarCheckScreen = () => {
    const [inputText, setInputText] = useState("");
    const [correctedText, setCorrectedText] = useState("");
    const apiKey = "P7b1h6xCkRb650yT";

    const handleGrammarCheck = async () => {
        try {
            const response = await axios.get("https://api.textgears.com/grammar", {
                params: {
                    key: apiKey,
                    text: inputText,
                    language: "en-GB",
                },
            });
            if (response.data && response.data.response) {
                let corrected = inputText;

                // Sort errors by offset in descending order
                const errors = response.data.response.errors.sort((a, b) => b.offset - a.offset);

                // Replace errors with suggestions
                errors.forEach((error) => {
                    if (error.better && error.better.length > 0) {
                        corrected = corrected.slice(0, error.offset) + error.better[0] + corrected.slice(error.offset + error.length);
                    }
                });

                setCorrectedText(corrected);
            }
        } catch (error) {
            console.error("Error fetching grammar check results:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Text style={styles.title}>Grammar Check</Text>
            <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                onChangeText={setInputText}
                value={inputText}
                placeholder="Enter your text here"
            />
            <TouchableOpacity style={styles.button} onPress={handleGrammarCheck}>
                <Text style={styles.buttonText}>Check Grammar</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.correctedText}
                multiline
                numberOfLines={4}
                value={correctedText}
                editable={false}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#1E90FF",
        borderRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    correctedText: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#F6F1F1",
    },
});

export default GrammarCheckScreen;

