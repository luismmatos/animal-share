import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from "react-native";

import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

import { searchRandomAnimalPhoto } from '../api/unsplash';
import { isValidAnimal, ANIMAL_EXAMPLES } from '../data/animals';

import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Sharing from 'expo-sharing';


export default function HomeScreen() {
    const [query, setQuery] = useState("");
    const [animalImage, setAnimalImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();

    const cameraRef = React.useRef(null);

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }


    const handleSearch = async () => {
        if (!query.trim()) {
            Alert.alert('Erro', 'Por favor, digite o nome de um animal');
            return;
        }

        if (!isValidAnimal(query)) {
            Alert.alert('Animal não encontrado', `Por favor, digite o nome de um animal válido. Exemplos: ${ANIMAL_EXAMPLES.slice(0, 6).join(', ')}, etc.`);
            return;
        }

        setAnimalImage(null);
        setLoading(true);
        
        try {
            const imageData = await searchRandomAnimalPhoto(query);
            setAnimalImage(imageData);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível encontrar uma imagem deste animal. Tente outro nome.');
        } finally {
            setLoading(false);
        }
    };

    const openCamera = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera para tirar fotos.');
                return;
            }
        }
        setShowCamera(true);
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });
                setCapturedPhoto(photo.uri);
                setShowCamera(false);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível tirar a foto.');
            }
        }
    };

    const deletePhoto = () => {
        Alert.alert(
            'Eliminar foto',
            'Tem a certeza que pretende eliminar esta foto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => setCapturedPhoto(null) }
            ]
        );
    };

    const sharePhoto = async () => {
        try {
            await Sharing.shareAsync(capturedPhoto, {
                mimeType: 'image/jpeg',
                dialogTitle: 'Partilhar foto'
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível partilhar a foto.');
        }
    };

    const backToCamera = () => {
        setCapturedPhoto(null);
        setShowCamera(true);
    };

    // ✅ FUNÇÃO ADICIONAL: Voltar para HomeScreen
    const backToHome = () => {
        setCapturedPhoto(null);
        setShowCamera(false);
    };


    // Se a câmera estiver aberta
    if (showCamera) {
        return (
            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing="back"
                >
                    <View style={styles.cameraControls}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setShowCamera(false)}
                        >
                            <Text style={styles.cancelText}>&#10005;</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.captureButton}
                            onPress={takePicture}
                        >
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        );
    }

    // Se há uma foto capturada
    if (capturedPhoto) {
        return (
            <View style={styles.photoPreviewContainer}>
                <Image 
                    source={{ uri: capturedPhoto }}
                    style={styles.capturedImage}
                    resizeMode="contain"
                />
                
                <View style={styles.photoActions}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={deletePhoto}
                    >
                        <Text style={styles.deleteButtonText}>&#128465; Eliminar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.shareButton]}
                        onPress={sharePhoto}
                    >
                        <Text style={styles.shareButtonText}>&#128228; Partilhar</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={backToCamera}
                >
                    <Text style={styles.backButtonText}>&#8592; Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.homeButton}
                    onPress={backToHome}
                >
                    <Text style={styles.homeButtonText}>&#10005; Sair</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Tela principal
    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <Text style={styles.icon}>&#128269;</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Search for animals..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>

            <View style={styles.centerContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#333" />
                ) : animalImage ? (
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: animalImage.url }}
                            style={styles.animalImage}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageCaption}>
                            {animalImage.alt || query}
                        </Text>
                        <Text style={styles.photographer}>
                            Foto por {animalImage.photographer}
                        </Text>
                        <TouchableOpacity 
                            style={styles.refreshButton}
                            onPress={() => handleSearch()}
                        >
                            <Text style={styles.refreshText}>&#128260; Nova imagem</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text style={styles.logo}>&#128062;</Text>
                        <Text style={styles.title}>Animal Share</Text>
                    </>
                )}
            </View>

            <TouchableOpacity
                style={styles.circleButton}
                onPress={openCamera}
            >
                <Text style={styles.circleText}>&#128247;</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fdfdfd',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    logo: {
        fontSize: 150,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        fontFamily: 'Poppins_700Bold',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 40,
    },
    icon: {
        fontSize: 20,
        marginRight: 5,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        fontFamily: 'Poppins_400Regular',
    },
    circleButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e5e5e5ff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 4,
    },
    circleText: {
        fontSize: 28,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        width: '100%',
    },
    animalImage: {
        width: 250,
        height: 250,
        borderRadius: 15,
        marginBottom: 15,
    },
    imageCaption: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
        textTransform: 'capitalize',
        fontFamily: 'Poppins_600SemiBold',
    },
    photographer: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 10,
        fontFamily: 'Poppins_400Regular',
    },
    refreshButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    refreshText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    cameraContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    cameraControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 30,
    },
    cancelButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    cancelText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    photoPreviewContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        position: 'relative',
    },
    capturedImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    photoActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 30,
        paddingHorizontal: 40,
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        minWidth: 120,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#ff4444',
    },
    shareButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins_600SemiBold',
    },
    shareButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins_600SemiBold',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    backButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins_600SemiBold',
    },
    homeButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    homeButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins_600SemiBold',
        textAlign: 'center',
    },
});