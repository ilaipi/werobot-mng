import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'wechat-robot',
          title: '微信机器人',
          blankTarget: true,
        },
        {
          key: 'sh-fs',
          title: '上海方穗科技有限公司',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 上海方穗科技有限公司
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
