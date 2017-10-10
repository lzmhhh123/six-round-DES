import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import './App.css';
import {
  Card,
  Tabs,
  InputNumber,
  Tag,
  Alert,
  Button,
  Upload,
  message,
  Icon
} from 'antd';

class SixRoundKeys extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  mapBinaryKey(key) {
    let array = new Array(12);
    for(let i = 1; i <= 12; ++i) {
      array[i - 1] = i;
    }
    return array.map(data => {
      return <span style={{marginLeft: (data > 1) * 24.5}} key={data}>
      {
        (() =>{
          let array = key;
          let s = '';
          for(let i = 3; i >= 0; --i) {
            s += key[(12 - data) * 4 + i];
          }
          return s;
        })()
      }
      </span>
    })
  }
  render() {
    return (
      <div style={{marginTop: 20, marginBottom: 20}}>
        <span>
          <Tag color="#108ee9">Key1(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key1)} type="success" style={{display: 'inline', marginLeft: 48}} />
        </span>
        <br />
        <br />
        <span>
          <Tag color="#108ee9">Key2(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key2)} type="success" style={{display: 'inline', marginLeft: 48}} />
        </span>
        <br />
        <br />
        <span>
          <Tag color="#108ee9">Key3(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key3)} type="success" style={{display: 'inline', marginLeft: 48}} />
        </span>
        <br />
        <br />
        <span>
          <Tag color="#108ee9">Key4(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key4)} type="success" style={{display: 'inline', marginLeft: 48}} />
        </span>
        <br />
        <br />
        <span>
          <Tag color="#108ee9">Key5(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key5)} type="success" style={{display: 'inline', marginLeft: 48}} />
        </span>
        <br />
        <br />
        <span>
          <Tag color="#108ee9">Key6(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key6)} type="success" style={{display: 'inline', marginLeft: 50}} />
        </span>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      encryptionKey: '',
      decryptionKey: '',
      encryptionGenerateDisabled: false,
      decryptionGenerateDisabled: false,
      encryptionKey1: [],
      encryptionKey2: [],
      encryptionKey3: [],
      encryptionKey4: [],
      encryptionKey5: [],
      encryptionKey6: [],
      decryptionKey1: [],
      decryptionKey2: [],
      decryptionKey3: [],
      decryptionKey4: [],
      decryptionKey5: [],
      decryptionKey6: [],
    };
    this.mapInputNumber = this.mapInputNumber.bind(this);
    this.generateKeys = this.generateKeys.bind(this);
  }
  componentWillMount() {
    let s = '';
    for(let i = 0; i < 64; ++i) {
      s += '0';
    }
    let key = new Array(48);
    for(let i = 0; i < 48; ++i) {
      key[i] = '0';
    }
    this.setState({
      encryptionKey: s,
      decryptionKey: s,
      encryptionKey1: key,
      encryptionKey2: key,
      encryptionKey3: key,
      encryptionKey4: key,
      encryptionKey5: key,
      encryptionKey6: key,
      decryptionKey1: key,
      decryptionKey2: key,
      decryptionKey3: key,
      decryptionKey4: key,
      decryptionKey5: key,
      decryptionKey6: key,
    });
  }
  mapInputNumber(className) {
    let array = new Array(16);
    for(let i = 1; i <= 16; ++i) {
      array[i - 1] = i;
    }
    return array.map(data => {
      return <InputNumber
        key={data}
        min={0}
        max={15}
        defaultValue={0}
        style={{width: 50, marginLeft: 5}}
        ref={className + (16 - data)}
        onChange={value => {
          let array = className === 'encryption' ? this.state.encryptionKey.split('') : this.state.decryptionKey.split('');
          for(let i = 0; i < 4; ++i) {
            array[(16 - data) * 4 + i] = (value & 1).toString();
            value >>= 1;
          }
          let s = '';
          for(let i = 0; i < 64; ++i) {
            s += array[i];
          }
          console.log(s);
          if (className === 'encryption') {
            this.setState({encryptionKey: s, encryptionGenerateDisabled: false});
          } else {
            this.setState({decryptionKey: s, decryptionGenerateDisabled: false});
          }
        }} />
    });
  }
  mapBinaryKey(key) {
    let array = new Array(16);
    for(let i = 1; i <= 16; ++i) {
      array[i - 1] = i;
    }
    return array.map(data => {
      return <span style={{marginLeft: (data > 1) * 24.5}} key={data}>
      {
        (() =>{
          let array = key.split('');
          let s = '';
          for(let i = 3; i >= 0; --i) {
            s += key[(16 - data) * 4 + i];
          }
          return s;
        })()
      }
      </span>
    })
  }
  generateKeys(event, className) {
    let key = '';
    console.log(className, key);
    if (className === 'encryption') {
      key = this.state.encryptionKey;
      this.setState({encryptionGenerateDisabled: true});
    } else {
      key = this.state.decryptionKey;
      this.setState({decryptionGenerateDisabled: true});
    }
    // TODO: add 6 rounds keys to here
    let table1 = [
      57, 49, 41, 33, 25, 17, 9,
      1, 58, 50, 42, 34, 26, 18,
      10, 2, 59, 51, 43, 35, 27,
      19, 11, 3, 60, 50, 44, 36
    ], table2 = [
      63, 55, 47, 39, 31, 23, 15,
      7, 62, 54, 46, 38, 30, 22,
      14, 6, 61, 53, 45, 37, 29,
      21, 13, 5, 28, 20, 12, 4
    ];
    key = key.split('');
    let A = new Array(28), B = new Array(28);
    for(let i = 0; i < 28; ++i) {
      A[i] = key[table1[i] - 1];
      B[i] = key[table2[i] - 1];
    }
    let C = new Array(56);
    let table4 = [
      14, 17, 11, 24, 1, 5, 3, 28,
      15, 6, 21, 10, 23, 19, 12, 4,
      26, 8, 16, 7, 27, 20, 13, 2,
      41, 52, 31, 37, 47, 55, 30, 40,
      51, 45, 33, 48, 44, 49, 39, 56,
      34, 53, 46, 42, 50, 36, 29, 32
    ]
    let rkey = new Array(6);
    let delta = 0;
    for(let i = 1; i <= 6; ++i) {
      delta++;
      if (i > 2) delta++;
      C = A.concat(B);
      rkey[i - 1] = new Array(48);
      for(let j = 1; j <= 48; ++j) {
        rkey[i - 1][j - 1] = C[table4[(j - 1 - delta + 48) % 48] - 1];
      }
    }
    if (className === 'encryption') {
      this.setState({
        encryptionKey1: rkey[0],
        encryptionKey2: rkey[1],
        encryptionKey3: rkey[2],
        encryptionKey4: rkey[3],
        encryptionKey5: rkey[4],
        encryptionKey6: rkey[5]
      })
    } else {
      this.setState({
        decryptionKey1: rkey[5],
        decryptionKey2: rkey[4],
        decryptionKey3: rkey[3],
        decryptionKey4: rkey[2],
        decryptionKey5: rkey[1],
        decryptionKey6: rkey[0]
      })
    }
  }
  render() {
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div className="Container">
        <Card>
          <Tabs tabPosition="left">
            <Tabs.TabPane key="encryption" tab="encryption">
              <span>
                <Tag color="blue">Key(Hexadecimal):</Tag>0x
                {this.mapInputNumber("encryption")}
                <br />
                <br />
                <Tag color="#108ee9">Key(Binary):</Tag>
                <Alert message={this.mapBinaryKey(this.state.encryptionKey)} type="success" style={{display: 'inline', marginLeft: 50}} />
              </span>
              <br />
              <br />
              <div style={{width: 'fit-content', width: '-webkit-fit-content', marginLeft: 150}}>
                <Button
                  type="primary"
                  icon="reload"
                  onClick={(event) => this.generateKeys(event, 'encryption')}
                  disabled={this.state.encryptionGenerateDisabled}
                >Generate six rounds keys</Button>
              </div>
              <SixRoundKeys
                key1={this.state.encryptionKey1}
                key2={this.state.encryptionKey2}
                key3={this.state.encryptionKey3}
                key4={this.state.encryptionKey4}
                key5={this.state.encryptionKey5}
                key6={this.state.encryptionKey6}
              />
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            </Tabs.TabPane>
            <Tabs.TabPane key="decryption" tab="decryption">
              <span>
                <Tag color="blue">Key(Hexadecimal):</Tag>0x
                {this.mapInputNumber("decryption")}
                <br />
                <br />
                <Tag color="#108ee9">Key(Binary):</Tag>
                <Alert message={this.mapBinaryKey(this.state.encryptionKey)} type="success" style={{display: 'inline', marginLeft: 50}} />
              </span>
              <br />
              <br />
              <div style={{width: 'fit-content', width: '-webkit-fit-content', marginLeft: 150}}>
                <Button
                  type="primary"
                  icon="reload"
                  onClick={(event) => this.generateKeys(event, 'decryption')}
                  disabled={this.state.decryptionGenerateDisabled}
                >Generate six rounds keys</Button>
              </div>
              <SixRoundKeys
                key1={this.state.decryptionKey1}
                key2={this.state.decryptionKey2}
                key3={this.state.decryptionKey3}
                key4={this.state.decryptionKey4}
                key5={this.state.decryptionKey5}
                key6={this.state.decryptionKey6}
              />
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default App;
