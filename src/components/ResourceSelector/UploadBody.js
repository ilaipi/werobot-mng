import React, { Fragment } from 'react';
import { Form, Upload, Modal, Icon } from 'antd';

const { Item: FormItem } = Form;

const types = {
  images: '图片',
  videos: '视频',
};

class UploadBody extends React.Component {
  state = {
    visible: false,
    previewImage: '',
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      visible: true,
    });
  };

  render() {
    const { visible, previewImage } = this.state;
    const { fileList = [], changeFileList, type, multi } = this.props;

    let action = '';
    let accept = '';
    const typeName = types[type];
    const label = `本地${typeName}`;

    if (type === 'images') {
      action = '/ueapi/actions/uploadMedia';
      accept = 'image/gif, image/jpeg, image/png';
    } else if (type === 'videos') {
      action = '/ueapi/actions/uploadMedia';
      accept = 'video/*';
    }

    return (
      <Fragment>
        <Form>
          <FormItem labelCol={{ sm: 3 }} label={label}>
            {type === 'videos' &&
              fileList.map(file => {
                if (file.state !== 'SUCCESS') {
                  return <Icon type="loading" className="loadVideo" />;
                }
                return (
                  <video key={file.url} src={file.url} preload="auto" className="video">
                    <track kind="captions" src={file.url} />
                  </video>
                );
              })}
            <Upload
              className={type === 'images' ? '' : 'uploadBody'}
              action={action}
              accept={accept}
              multiple={multi}
              name="files"
              listType="picture-card"
              fileList={fileList}
              headers={{ authorization: 'authorization-text' }}
              showUploadList={type === 'images'}
              onChange={changeFileList}
              onPreview={this.handlePreview}
            >
              {fileList.length >= 10 ? null : (
                <Fragment>
                  <Icon type="plus" />
                  <div className="ant-upload-text"> 上传 </div>
                </Fragment>
              )}
            </Upload>
          </FormItem>
        </Form>
        <Modal visible={visible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Fragment>
    );
  }
}

export default UploadBody;
