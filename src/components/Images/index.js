import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { map, isEmpty } from 'lodash';

import styles from './style.less';

const Image = props => {
  const { thumb, id, unselect, allowclear } = props;
  return (
    <li className={styles.imgItem} key={id}>
      <img src={thumb} alt="" />
      {allowclear && (
        <a
          className={styles.closeModal}
          onClick={() => {
            unselect({ data: thumb });
          }}
        >
          x
        </a>
      )}
    </li>
  );
};

const ImageList = ({ thumb, allowclear, unselect }) =>
  map(thumb, ({ url, id }) => (
    <Image allowclear={allowclear} thumb={url} id={id} unselect={unselect} />
  ));

class Images extends PureComponent {
  render() {
    const { thumb, unselect, allowclear = false, open } = this.props;
    return (
      <Row>
        <Col>
          <ul className={styles.imgList}>
            {!isEmpty(thumb) &&
              (Array.isArray(thumb) ? (
                <ImageList thumb={thumb} allowclear={allowclear} unselect={unselect} />
              ) : (
                <Image allowclear={allowclear} thumb={thumb} id={thumb} unselect={unselect} />
              ))}
            <li className={styles.imgItem} key="addPic">
              <a className={styles.addGoods} onClick={() => open()}>
                {' '}
                +加图{' '}
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    );
  }
}

export default Images;
