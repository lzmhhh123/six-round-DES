import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import './App.css';
import {Card, Tabs, InputNumber, Tag, Alert, Button} from 'antd';

class App extends Component {
  constructor() {
    super();
    this.state = {
      encryptionKey: '',
      decryptionKey: ''
    };
    this.mapInputNumber = this.mapInputNumber.bind(this);
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
            this.setState({encryptionKey: s});
          } else {
            this.setState({decryptionKey: s});
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
  generateKeys(key) {

  }
  render() {
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
              <Button type="primary" icon="reload" onClick={(event) => this.generateKeys(event, this.state.encryptionKey)}>Generate six rounds keys</Button>
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
              <Button type="primary" icon="reload" onClick={(event) => this.generateKeys(event, this.state.decryptionKey)}>Generate six rounds keys</Button>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default App;
