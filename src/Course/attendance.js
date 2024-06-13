import { Table, Avatar } from '@douyinfe/semi-ui';
import React, { useEffect } from 'react';
import http from '../http';

export function attendanceModal({ specialAttendance }) {
  const columns = [
    {
      title: '时间',
      dataIndex: 'updateTime',
    },
    {
      title: '姓名',
      dataIndex: 'student',
    },
    {
      title: '详情',
      dataIndex: 'state',
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={specialAttendance}
        pagination={false}
      />
    </>
  );
}
