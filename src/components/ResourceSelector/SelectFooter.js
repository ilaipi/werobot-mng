import React from 'react';
import { Row, Col, Button } from 'antd';

const SelectFooter = props => {
  const { updateSupField, close } = props;
  return (
    <Row gutter={16}>
      <Col sm={6}>
        <Button onClick={() => updateSupField('mode', 'upload')} style={{ width: '100%' }}>
          上传
        </Button>
      </Col>
      <Col sm={{ offset: 14, span: 4 }}>
        <Button style={{ width: '100%' }} type="primary" onClick={() => close()}>
          确定
        </Button>
      </Col>
    </Row>
  );
};

export default SelectFooter;
