import React, { Fragment, PureComponent } from 'react';
import { Input } from 'antd';
import { trimStart } from 'lodash';

import styles from './PhoneView.less';

class PhoneView extends PureComponent {
  render() {
    const { value, onChange } = this.props;
    let values = ['', ''];
    if (value) {
      values = value.split('-');
      if (!values[1]) {
        [ values[1] ] = values;
        values[0] = '';
      }
    }
    return (
      <Fragment>
        <Input
          className={styles.area_code}
          value={values[0]}
          onChange={e => {
            onChange(trimStart(`${e.target.value}-${values[1]}`, '-'));
          }}
        />
        <Input
          className={styles.phone_number}
          onChange={e => {
            onChange(trimStart(`${values[0]}-${e.target.value}`, '-'));
          }}
          value={values[1]}
        />
      </Fragment>
    );
  }
}

export default PhoneView;
