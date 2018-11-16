import React from 'react';
import { Icon, Pagination } from 'antd';
import { map } from 'lodash';
import styles from './style.less';

const SelectBody = props => {
  const { dataSource, selected, current, pageSize: size, handlePageChange, selectRes } = props;
  const selectedList = Array.isArray(selected) ? selected : [selected];
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <div style={{ width: '100%', height: '460px' }}>
        <ul>
          {map(dataSource.list, ({ id, name, url }) => (
            <li className={styles.imgItem} key={id}>
              <div
                className={styles.imgBox}
                style={{ backgroundImage: `url(${url})` }}
                onClick={() => {
                  selectRes(url);
                }}
              />
              <div className={styles.imgTitle}>{name}</div>
              {selectedList.indexOf(url) > -1 && (
                <div className={styles.imgSelected}>
                  <Icon type="check" />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ul>
        <Pagination
          total={dataSource && dataSource.total}
          pageSize={size}
          current={current}
          onChange={(page, pageSize) => {
            handlePageChange(page, pageSize);
          }}
        />
      </ul>
    </div>
  );
};

export default SelectBody;
