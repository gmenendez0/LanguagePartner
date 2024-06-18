import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TagPickerProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    input_text: string;
}

const TagPicker: React.FC<TagPickerProps> = ({ tags, setTags, input_text}) => {
    const [inputValue, setInputValue] = useState<string>('');

    const addTag = () => {
        if (inputValue.trim() && !tags.includes(inputValue.trim())) {
            let newTag = inputValue.trim();
            setTags([...tags, newTag]);
            setInputValue('');
            console.log("Added tag: " + newTag);
        }
    };

    const removeTag = (index: number, tag: string) => {
        setTags(tags.filter((_, i) => i !== index));
        console.log("Removed tag: " + tag);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={input_text}
                    value={inputValue}
                    onChangeText={setInputValue}
                    onSubmitEditing={addTag}
                />
                <TouchableOpacity style={styles.addButton} onPress={addTag}>
                    <Icon name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
                {tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                        <TouchableOpacity onPress={() => removeTag(index, tag)}>
                            <Icon name="close" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        backgroundColor: '#222',
        width: '100%',
        alignSelf: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    textInput: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginRight: 8,
        color: '#FFF',
    },
    addButton: {
        backgroundColor: '#e60041',
        padding: 10,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e60041',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 8,
        margin: 4,
    },
    tagText: {
        color: 'white',
        marginRight: 4,
    },
});

export default TagPicker;
