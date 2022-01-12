/**
 * Copyright (c) OpenSpug Organization. https://github.com/openspug/spug
 * Copyright (c) <spug.dev@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Input, Row, Col } from 'antd';
import { ACEditor } from 'components';
import { cleanCommand } from 'libs';
import Tips from './Tips';
import store from './store';

export default observer(function () {
  function handleNext() {
    store.page += 1
  }

  const info = store.deploy;
  return (
    <Form layout="vertical" style={{padding: '0 120px'}}>
      <Form.Item required label="部署路径" tooltip="应用最终在主机上的部署路径，为了数据安全请确保该目录不存在，Spug 将会自动创建并接管该目录，例如：/var/www/html">
        <Input value={info['dst_dir']} onChange={e => info['dst_dir'] = e.target.value} placeholder="请输入部署目标路径"/>
      </Form.Item>
      <Row gutter={24}>
        <Col span={14}>
          <Form.Item required label="存储路径" tooltip="此目录用于存储应用的历史版本，例如：/data/spug/repos">
            <Input value={info['dst_repo']} onChange={e => info['dst_repo'] = e.target.value} placeholder="请输入部署目标路径"/>
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item required label="版本数量" tooltip="早于指定数量的历史版本会被删除，以释放磁盘空间。">
            <Input value={info['versions']} onChange={e => info['versions'] = e.target.value} placeholder="请输入保存的版本数量"/>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="应用发布前执行"
        tooltip="在发布的目标主机上运行，当前目录为目标主机上待发布的源代码目录，可执行任意自定义命令。"
        extra={<span>{Tips}，此时还未进行文件变更，可进行一些发布前置操作。</span>}>
        <ACEditor
          readOnly={store.isReadOnly}
          mode="sh"
          theme="tomorrow"
          width="100%"
          height="40px"
          placeholder="输入要执行的命令"
          value={info['hook_pre_host']}
          onChange={v => info['hook_pre_host'] = cleanCommand(v)}
          style={{border: '1px solid #e8e8e8'}}/>
      </Form.Item>
      <Form.Item
        label="应用发布后执行"
        style={{marginTop: 12, marginBottom: 24}}
        tooltip="在发布的目标主机上运行，当前目录为已发布的应用目录，可执行任意自定义命令。"
        extra={<span>{Tips}，可以在发布后进行重启服务等操作。</span>}>
        <ACEditor
          readOnly={store.isReadOnly}
          mode="sh"
          theme="tomorrow"
          width="100%"
          height="120px"
          placeholder="输入要执行的命令"
          value={info['hook_post_host']}
          onChange={v => info['hook_post_host'] = cleanCommand(v)}
          style={{border: '1px solid #e8e8e8'}}/>
      </Form.Item>
      <Form.Item wrapperCol={{span: 14, offset: 6}}>
        <Button type="primary" onClick={handleNext}>下一步</Button>
        <Button style={{marginLeft: 20}} onClick={() => store.page -= 1}>上一步</Button>
      </Form.Item>
    </Form>
  )
})