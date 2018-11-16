import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import SelectImageBody from './SelectImageBody';
import SelectVideoBody from './SelectVideoBody';
import SelectFooter from './SelectFooter';
import UploadBody from './UploadBody';
import UploadFooter from './UploadFooter';
import './style.less';

const TYPES = {
  images: '图片',
  videos: '视频',
};

@connect(({ richtext }) => ({
  dataSource: richtext.imgList,
}))
class ResourceSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: 15,
      mode: 'select', // select or upload
      selected: '',
      fileList: [],
    };
  }

  componentDidMount() {
    this.initial();
    this.fetchSources();
  }

  initial = () => {
    const { mode, selected } = this.props;
    this.setState({ mode, selected });
  };

  getTitle = () => {
    const { type } = this.props;
    const { mode } = this.state;
    const typeName = TYPES[type];
    if (mode === 'select') {
      return `请选择${typeName}`;
    }
    if (mode === 'upload') {
      return (
        <div>
          <a onClick={() => this.setState({ mode: 'select' })}> {`< 选择${typeName}`} </a>
          {` | 上传${typeName}`}
        </div>
      );
    }
    return <Fragment />;
  };

  changeFileList = ({ fileList: origin }) => {
    // let fileList = origin.slice();
    const fileList = origin.map(file => {
      if (file.status === 'done') {
        this.selectRes(file.response.url);
        return { ...file.response, uid: file.response.url };
      }
      return file;
    });
    this.setState({ fileList });
  };

  fetchSources = () => {
    const { dispatch, type } = this.props;
    const { page, limit } = this.state;
    const url = type === 'images' ? 'fetchImgs' : 'fetchVideos';
    dispatch({
      type: `richtext/${url}`,
      payload: {
        start: page,
        size: limit,
      },
    });
  };

  closeModal = () => {
    const { closeModal } = this.props;
    const { selected } = this.state;
    closeModal(selected);
  };

  updateState = (field, value) => {
    this.setState({ [field]: value });
  };

  handlePageChange = page => {
    this.setState({ page }, this.fetchSources);
  };

  selectRes = value => {
    const { multi } = this.props;
    if (!multi) {
      this.setState({ selected: value });
    } else {
      this.setState(({ selected }) => ({
        selected: [...selected, value],
      }));
    }
  };

  render() {
    const { multi, visible, type, dataSource } = this.props;
    const { page, limit, mode, selected, fileList } = this.state;

    let Footer = SelectFooter;
    let Body = SelectImageBody;
    if (mode === 'upload') {
      Footer = UploadFooter;
      Body = UploadBody;
    }
    if (mode === 'select' && type === 'videos') {
      Body = SelectVideoBody;
    }

    return (
      <Modal
        title={this.getTitle()}
        visible={visible}
        width="800px"
        onCancel={this.closeModal}
        maskClosable={false}
        footer={<Footer close={this.closeModal} updateSupField={this.updateState} />}
      >
        <Body
          multi={multi}
          type={type}
          dataSource={dataSource}
          fileList={fileList}
          current={page} // 当前页
          pageSize={limit}
          selected={selected}
          handlePageChange={this.handlePageChange}
          selectRes={this.selectRes} // 选中处理
          changeFileList={this.changeFileList} // 上传
        />
      </Modal>
    );
  }
}

export default ResourceSelector;
