/**
 * Copyright (c) OpenSpug Organization. https://github.com/openspug/spug
 * Copyright (c) <spug.dev@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Input, Row, Col, message } from 'antd';
import { ACEditor } from 'components';
import { http, cleanCommand } from 'libs';
import Tips from './Tips';
import store from './store';

export default observer(function () {
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    const {dst_dir, dst_repo} = store.deploy;
    const t_dst_dir = dst_dir.replace(/\/*$/, '/');
    const t_dst_repo = dst_repo.replace(/\/*$/, '/');
    if (t_dst_repo.includes(t_dst_dir)) {
      return message.error('存储路径不能位于部署路径内')
    }
    setLoading(true);
    const info = store.deploy;
    info['app_id'] = store.app_id;
    info['extend'] = '1';
    http.post('/api/app/deploy/', info)
      .then(() => {
        message.success('保存成功');
        store.loadDeploys(store.app_id);
        store.ext1Visible = false
      }, () => setLoading(false))
  }

  const info = store.deploy;
  return (
    <Form layout="vertical" style={{padding: '0 120px'}}>
      <Form.Item
        label="设置任务后执行"
        style={{marginTop: 12, marginBottom: 24}}
        tooltip="在发布的目标主机发布目录上运行,可执行任意自定义命令。"
        extra={<span>{Tips}，可以通知对应服务将定时重启这个事情</span>}>
        <ACEditor
          readOnly={store.isReadOnly}
          mode="sh"
          theme="tomorrow"
          width="100%"
          height="140px"
          placeholder="输入要执行的命令"
          value={info['hook_plan']}
          onChange={v => info['hook_plan'] = cleanCommand(v)}
          style={{border: '1px solid #e8e8e8'}}/>
      </Form.Item>
      <Form.Item
        label="取消任务后执行"
        style={{marginTop: 12, marginBottom: 24}}
        tooltip="在发布的目标主机发布目录上运行,可执行任意自定义命令。"
        extra={<span>{Tips}，可以通知对应服务将定时重启这个事情</span>}>
        <ACEditor
          readOnly={store.isReadOnly}
          mode="sh"
          theme="tomorrow"
          width="100%"
          height="140px"
          placeholder="输入要执行的命令"
          value={info['hook_plan_cancel']}
          onChange={v => info['hook_plan_cancel'] = cleanCommand(v)}
          style={{border: '1px solid #e8e8e8'}}/>
      </Form.Item>
      <Form.Item wrapperCol={{span: 14, offset: 6}}>
        <Button disabled={store.isReadOnly} loading={loading} type="primary" onClick={handleSubmit}>提交</Button>
        <Button style={{marginLeft: 20}} onClick={() => store.page -= 1}>上一步</Button>
      </Form.Item>
    </Form>
  )
})