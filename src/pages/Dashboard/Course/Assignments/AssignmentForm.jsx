/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  Upload,
  Row,
  Col,
  Form,
  Input,
  Button,
  Icon,
  DatePicker,
  Select,
  InputNumber,
  message
} from 'antd';
import Quill from 'Components/Quill/Quill';
import Ace from 'Components/Ace/Ace';
import TestCaseInput from 'Components/TestCaseInput/TestCaseInput';

const { Dragger } = Upload;
const { Option } = Select;

// Simple Counter for generating different test IDs
let id = 0;

class CustomForm extends Component {
  formItemLayout = {
    labelCol: {
      xs: { span: 24 }
    },
    wrapperCol: {
      xs: { span: 24 }
    },
    labelAlign: 'left'
  };

  draggerProps = {
    name: 'supportingFiles',
    accept: '.zip,.tar.gz',
    beforeUpload: () => {
      this.setState({ fileSelected: true });
      return false;
    },
    onRemove: () => {
      this.setState({ fileSelected: false });
    }
  };

  state = {
    fileSelected: false
  };

  addTestCase = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat((id += 1));
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  removeTestCase = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        const formData = new FormData();
        formData.append('language', values.language);
        // formData.append('version', values.version);
        formData.append('name', values.name);
        formData.append('numAttempts', values.numAttempts);
        formData.append('description', values.description.text);
        formData.append('dueDate', values.dueDate.valueOf());
        formData.append('testBuildCMD', values.buildCMD.text);
        if (values.supportingFiles)
          formData.append('supportingFiles', values.supportingFiles.file);
        values.testCases.forEach((test, i) => {
          formData.append(
            'tests',
            JSON.stringify({ name: `Test ${i + 1}`, ...test })
          );
        });
        await onSubmit(formData);
      } else {
        message.error('Please fill all fields!');
      }
    });
  };

  renderTestCases = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    return keys.map((k, index, allKeys) => (
      <Form.Item label={`Test Case ${index + 1}`} required={false} key={k}>
        {getFieldDecorator(`testCases[${index}]`, {
          rules: [{ required: true, message: 'Please enter a test case!' }]
        })(
          <TestCaseInput
            cmdName={`testCase-name-${index}`}
            outputName={`testCase-output-${index}`}
            onRemove={() => this.removeTestCase(k)}
            allKeys={allKeys}
          />
        )}
      </Form.Item>
    ));
  };

  render() {
    const { handleSubmit, formItemLayout, draggerProps } = this;
    const { fileSelected } = this.state;
    const { title, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <>
        {title && <h1>{title}</h1>}
        <Form {...formItemLayout} hideRequiredMark onSubmit={handleSubmit}>
          <Form.Item label="Assignment Name">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please enter an assignment name!'
                }
              ]
            })(<Input placeholder="Assignment Name" />)}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator('description', {
              rules: [
                { required: true, message: 'Please enter a description!' }
              ]
            })(<Quill placeholder="Type a Description Here!" />)}
          </Form.Item>
          <Form.Item label="Language">
            {getFieldDecorator('language', {
              rules: [{ required: true, message: 'Please choose a language!' }]
            })(
              <Select placeholder="Pick a Programming Language">
                <Option value="python">Python</Option>
                <Option value="java">Java</Option>
                <Option value="c">C</Option>
                <Option value="c++">C++</Option>
              </Select>
            )}
          </Form.Item>
          <Row>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="Due Date">
                {getFieldDecorator('dueDate', {
                  rules: [
                    { required: true, message: 'Please select a due date!' }
                  ]
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="Maximum Allowed Submissions">
                {getFieldDecorator('numAttempts', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select a number of attempts!'
                    }
                  ]
                })(<InputNumber min={1} max={Infinity} placeholder="5" />)}
                <span className="ant-form-text"> submissions</span>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Supporting File(s)">
            {getFieldDecorator('supportingFiles', {
              rules: [{ required: true, message: 'Please upload a file!' }]
            })(
              <Dragger {...draggerProps} disabled={fileSelected}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload!
                </p>
              </Dragger>
            )}
          </Form.Item>
          <Form.Item label="Build Command">
            {getFieldDecorator('buildCMD', {
              rules: [
                { required: true, message: 'Please enter a build command!' }
              ]
            })(
              <Ace
                defaultStr={
                  '# Shell Commands to initialize each assignment\n# Use for Makefiles, installing dependencies, etc\n'
                }
                name="buildCMD"
                width="100%"
                height="200px"
              />
            )}
          </Form.Item>
          {this.renderTestCases()}
          <Form.Item>
            <Button
              type="dashed"
              onClick={this.addTestCase}
              style={{ width: '100%' }}
            >
              <Icon type="plus" /> Add Test Case
            </Button>
          </Form.Item>
          <Row type="flex" justify="center">
            <Button type="primary" icon="export" htmlType="submit">
              Create Assignment
            </Button>
          </Row>
        </Form>
      </>
    );
  }
}

export default Form.create()(CustomForm);
