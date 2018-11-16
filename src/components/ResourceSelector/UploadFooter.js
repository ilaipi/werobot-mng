import React from 'react';
import { Row, Col, Button } from 'antd';

const UploadFooter = props => {
  const { close } = props;
  return (
    <Row gutter={16}>
      <Col sm={{ span: 8, offset: 8 }}>
        <Button type="primary" style={{ width: '100%' }} onClick={() => close()}>
          确定
        </Button>
      </Col>
    </Row>
  );
};

export default UploadFooter;
