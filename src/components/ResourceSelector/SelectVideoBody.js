import React from 'react';
import moment from 'moment';
import { Table, Button } from 'antd';

import './style.less';

const columns = [
  {
    dataIndex: 'name',
    title: '视频名称',
  },
  {
    dataIndex: 'createdAt',
    title: '上传时间',
    render: value => moment(value).format('YYYY-MM-DD'),
  },
  {
    dataIndex: 'url',
    title: '操作',
    render: (url, { name }) => (
      <div>
        <Button style={{ marginLeft: '10px' }} href={url} target="_blank" download={name}>
          {' '}
          下载{' '}
        </Button>
      </div>
    ),
  },
];

const SelectBody = props => {
  const {
    current,
    multi,
    selected,
    dataSource: { list, total },
    handlePageChange,
    selectRes,
  } = props;
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <div style={{ width: '100%', height: '460px' }}>
        <ul>
          <Table
            bordered
            dataSource={list}
            columns={columns}
            rowKey="url"
            pagination={{
              hideOnSinglePage: true,
              total,
              pageSize: 6,
              current,
              onChange: (page, pageSize) => {
                handlePageChange(page, pageSize);
              },
            }}
            rowSelection={{
              hideDefaultSelections: true,
              selectedRowKeys: Array.isArray(selected) ? selected : [selected],
              type: multi ? 'checkbox' : 'radio',
              onChange: selectedRowKeys => {
                // const rows = map(selectedRowKeys, row => ({ url: row }));
                selectRes(selectedRowKeys);
              },
            }}
          />
        </ul>
      </div>
    </div>
  );
};

export default SelectBody;
