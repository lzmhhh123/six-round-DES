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

class sixRoundKeys extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  mapBinaryKey(key) {
    let array = new Array(14);
    for(let i = 1; i <= 14; ++i) {
      array[i - 1] = i;
    }
    return array.map(data => {
      return <span style={{marginLeft: (data > 1) * 24.5}} key={data}>
      {
        (() =>{
          let array = key.split('');
          let s = '';
          for(let i = 3; i >= 0; --i) {
            s += key[(14 - data) * 4 + i];
          }
          return s;
        })()
      }
      </span>
    })
  }
  render() {
    return (
      <div>
        <span>
          <Tag color="#108ee9">Key1(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key1)} type="success" style={{display: 'inline', marginLeft: 50}} />
        </span>
        <span>
          <Tag color="#108ee9">Key2(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key2)} type="success" style={{display: 'inline', marginLeft: 50}} />
        </span>
        <span>
          <Tag color="#108ee9">Key3(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key3)} type="success" style={{display: 'inline', marginLeft: 50}} />
        </span>
        <span>
          <Tag color="#108ee9">Key4(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key4)} type="success" style={{display: 'inline', marginLeft: 50}} />
        </span>
        <span>
          <Tag color="#108ee9">Key5(Binary):</Tag>
          <Alert message={this.mapBinaryKey(this.props.key5)} type="success" style={{display: 'inline', marginLeft: 50}} />
        </span>
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
      decryptionGenerateDisabled: false
    };
    this.mapInputNumber = this.mapInputNumber.bind(this);
    this.generateKeys = this.generateKeys.bind(this);
  }
  componentWillMount() {
    let s = '';
    for(let i = 0; i < 64; ++i) {
      s += '0';
    }
    this.setState({encryptionKey: s, decryptionKey: s});
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
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default App;
