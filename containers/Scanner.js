import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Colors } from '../utils';
import Swiper from 'react-native-swiper';
import axios from 'axios';

const landmarkSize = 2;

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

export default class CameraScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    photoId: 1,
    showGallery: false,
    photos: [],
    faces: [],
    codes: [],
    flows: []
  };

  componentDidMount(){
    axios.get('206.189.79.191/users/5b94df6519e6112f03be718b/flows')
      .then(res => {
        this.setState({flows: res.data.payload})
      })
      .catch(err => {
        console.log('Err Scanner', err);
      })
  }

  getRatios = async function() {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleView() {
    this.setState({
      showGallery: !this.state.showGallery,
    });
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  setRatio(ratio) {
    this.setState({
      ratio,
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function() {
    if (this.camera) {
      this.camera.takePictureAsync().then(data => {
        console.log('data: ', data);
      });
    }
  };

  onBarCodeRead = code => {
    console.log('CODE', code);
    if(code){
      return axios.post('http://206.189.79.191/flows/5b951dfdb1757c5b960852e3/run', {
        token: code.data
      })
        .then(res => {
          console.log(res)
          this.props.navigation.navigate('Confirmation', res.data.payload)
        })
        .catch(err => {
          console.log(err)
        })
    }
  };

  onFacesDetected = ({ faces }) => this.setState({ faces });
  onFaceDetectionError = state => console.warn('Faces detection error:', state);

  renderFace({ bounds, faceID, rollAngle, yawAngle }) {
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      >
        <Text style={styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
      </View>
    );
  }

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderFace)}
      </View>
    );
  }

  renderLandmarks() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderLandmarksOfFace)}
      </View>
    );
  }

  render() {
    console.log('Screen Props', this.props);
    return (
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={{
              flex: 1,
            }}
            type={this.state.type}
            flashMode={this.state.flash}
            autoFocus={this.state.autoFocus}
            zoom={this.state.zoom}
            whiteBalance={this.state.whiteBalance}
            ratio={this.state.ratio}
            faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
            onFacesDetected={this.onFacesDetected}
            onFaceDetectionError={this.onFaceDetectionError}
            onBarCodeRead={this.onBarCodeRead}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr, RNCamera.Constants.BarCodeType.aztec]}
            focusDepth={this.state.depth}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
          >
            <View
              style={{
                flex: 0.5,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
                <Text style={styles.flipText}> FLIP </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash.bind(this)}>
                <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.flipButton} onPress={this.toggleWB.bind(this)}>
                <Text style={styles.flipText}> WB: {this.state.whiteBalance} </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.4,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                alignSelf: 'flex-end',
              }}
            >
              <Slider
                style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}
                onValueChange={this.setFocusDepth.bind(this)}
                step={0.1}
                disabled={this.state.autoFocus === 'on'}
              />
            </View>
            <View
              style={{
                flex: 0.1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                alignSelf: 'flex-end',
              }}
            >
              <TouchableOpacity
                style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                onPress={this.zoomIn.bind(this)}
              >
                <Text style={styles.flipText}> + </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                onPress={this.zoomOut.bind(this)}
              >
                <Text style={styles.flipText}> - </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
                onPress={this.toggleFocus.bind(this)}
              >
                <Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
                onPress={this.takePicture.bind(this)}
              >
                <Text style={styles.flipText}> SNAP </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.flipButton, styles.galleryButton, { flex: 0.25, alignSelf: 'flex-end' }]}
                onPress={this.toggleView.bind(this)}
              >
                <Text style={styles.flipText}> Gallery </Text>
              </TouchableOpacity>
            </View>
            {this.renderFaces()}
            {this.renderLandmarks()}
          </RNCamera>
        </View>
        <View style={styles.infoContainer}>
          <Text style={{fontSize: 25}}> Retiro rápido </Text>
          <Text style={{fontSize: 15}}> Tarjeta terminación 1123 </Text>
        </View>
        <Swiper style={styles.flowContainer}>
          <View style={styles.flowSlide}>
            <Text style={{fontSize: 40, color: Colors.liteBlue}}> $500.00 </Text>
            <Text style={{fontSize: 20}}> Gasto Gasolina </Text>
          </View>
          <View style={styles.flowSlide}>
            <Text style={{fontSize: 40, color: Colors.liteBlue}}> $1200.00 </Text>
            <Text style={{fontSize: 20}}> Mantenimiento Carro </Text>
          </View>
          <View style={styles.flowSlide}>
            <Text style={{fontSize: 40, color: Colors.liteBlue}}> $600.00 </Text>
            <Text style={{fontSize: 20}}> Super </Text>
          </View>
        </Swiper>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.coolGray
  },
  flowContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white
  },
  flowSlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigation: {
    flex: 1,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  item: {
    margin: 4,
    backgroundColor: 'indianred',
    height: 35,
    width: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  galleryButton: {
    backgroundColor: 'indianred',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
  },
});