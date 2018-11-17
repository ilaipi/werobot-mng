import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
} from 'antd';
import { map } from 'lodash';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './style.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ wechatmessage, room, loading }) => ({
  wechatmessage,
  room,
  loading: loading.models.wechatmessage,
}))
@Form.create()
class AutoReply extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    page: 1,
    limit: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page, limit } = this.state;
    dispatch({
      type: 'wechatmessage/list',
      payload: { page, limit },
    });
    dispatch({
      type: 'room/list',
    });
  }

  columns = () => {
    const { room: { list } } = this.props;
    const filters = map(list, ({ code, name }) => ({ text: name, value: code }));
    return [
      {
        title: '发送者',
        dataIndex: 'extra.from.name',
        render(val, record) {
          return (
            <div>
              <img src={record.extra.from.avatar} alt="头像" style={{ width: '36px', height: '36px' }} />
              <span>{val}</span>
            </div>
          );
        },
      },
      {
        title: '发送给',
        dataIndex: 'extra.to.name',
        filters,
        render(val, record) {
          return `${val}${record.extra.to.code ? '（群）' : ''}`;
        },
      },
      {
        title: '消息内容',
        width: '300px',
        dataIndex: 'payload.text',
      },
      {
        title: '发送时间',
        dataIndex: 'payload.timestamp',
        render(val) {
          return moment(new Date(val * 1000)).format('YYYY-MM-DD HH:mm');
        },
      },
    ];
  };

  handleStandardTableChange = (pagination, filtersArg) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    this.setState({ ...params }, () => this.search(params));
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      }, () => {
        this.search(values);
      });
    });
  };

  search = params => {
    const { dispatch } = this.props;
    const { page, limit } = this.state;
    dispatch({
      type: 'wechatmessage/list',
      payload: {
        page,
        limit,
        ...params,
      },
    });
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('key')(<Input placeholder="请输入关键词" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      wechatmessage: { data },
      loading,
    } = this.props;
    const { selectedRows, page, limit } = this.state;
    const columns = this.columns();
    const pagination = {
      current: page,
      pageSize: limit,
      total: data.total,
      // showQuickJumper: true,
      // showSizeChanger: true,
      // pageSizeOptions: ['1', '3', '10', '20']
    };

    return (
      <PageHeaderWrapper title="自动回复">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={{ list: data.docs, pagination }}
              columns={columns}
              rowKey='id'
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AutoReply;
