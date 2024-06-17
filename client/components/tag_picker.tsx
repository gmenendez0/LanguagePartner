import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

interface TagPickerProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    input_text: string;
}

const TagPicker: React.FC<TagPickerProps> = ({ tags, setTags, input_text }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const addTag = () => {
        if (inputValue.trim() && !tags.includes(inputValue.trim())) {
            let newTag = inputValue.trim();
            setTags([...tags, newTag]);
            setInputValue('');
            // tag added TODO send to the server
            console.log("Added tag: " + newTag);
        }
    };

    const removeTag = (index: number, tag: string) => {
        setTags(tags.filter((_, i) => i !== index));
        // tag removed TODO send to the server
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
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        width: '80%', // Adjusted width
        alignSelf: 'center', // Center the component
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    textInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginRight: 8,
    },
    addButton: {
        backgroundColor: '#e60041',
        padding: 10,
        borderRadius: 15,
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
