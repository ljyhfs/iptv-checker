import { useState, useContext, useEffect } from 'react'
import { MainContext } from './../../context/main';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import PropTypes from 'prop-types';
import GetAppIcon from '@mui/icons-material/GetApp';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Sort from './sort'
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function SimpleDialog(props) {
  const _mainContext = useContext(MainContext);

  //mod == 1 下载界面 2预览原始m3u信息
  const { onClose, open, mod, clearSelectedArrFunc, setDialogMod, selectedArr } = props;

  const [showTextAreaLable, setShowTextAreaLable] = useState('')
  const [selectedGroups, setSelectedGroups] = useState('')
  const [groupTab, setGroupTab] = useState(0)
  const [customGroupName, setCustomGroupName] = useState('')

  useEffect(() => {
    setGroupTab(0)
    setSelectedGroups('')
    if (mod === 1) {
      setShowTextAreaLable('您所选择的m3u信息')
    } else if (mod === 2) {
      setShowTextAreaLable('原始m3u信息')
    } else if (mod === 3) {
      setShowTextAreaLable('设置')
    } else if (mod === 4) {
      setShowTextAreaLable('排序(数据较多时,可能影响排序列表性能,建议分批操作)')
    } else if (mod === 5) {
      setShowTextAreaLable('更改分组') 
    }
  }, [mod])

  const handleClose = () => {
    onClose();
  };

  const handleChangeCheckMillisSeconds = (e) => {
    _mainContext.changeCheckMillisSeconds(parseInt(e.target.value, 10))
  }

  const handleChangeHttpRequestTimeout = (e) => {
    _mainContext.changeHttpRequestTimeout(parseInt(e.target.value, 10))
  }

  const handleChangeShowUrl = (event) => {
    _mainContext.changeShowUrl(event.target.checked);
  }

  const doDownload = () => {
    var a = document.createElement('a')
    var blob = new Blob([_mainContext.exportDataStr])
    var url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = 'iptv-checker-' + (new Date()).getTime() + ".m3u"
    a.click()
  }

  const doDoAgain = () => {
    _mainContext.changeOriginalM3uBody(_mainContext.exportDataStr)
    clearSelectedArrFunc()
    onClose();
  }

  const doNextStep = () => {
    setDialogMod(1)
    _mainContext.onChangeExportStr()
  }

  const doBackward = () => {
    setDialogMod(4)
  }

  const handleChangeGroup = (e) => {
    setSelectedGroups(e.target.value)
  }

  const doTransferGroup = () => {
    if(groupTab === 0) {
      _mainContext.batchChangeGroupName(selectedArr, selectedGroups)
      onClose();
    }else{
      _mainContext.addGroupName(customGroupName)
      setGroupTab(0)
    }
  }

  const handleChangeGroupTab = (event, newValue) => {
    setGroupTab(newValue);
  };

  const changeCustomGroupName = (e) => {
    setCustomGroupName(e.target.value)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box style={{ minWidth: '600px', 'maxHeight': '600px', 'paddingTop': '10px', 'paddingLeft': '10px' }}>{showTextAreaLable}</Box>
      {
        mod === 3 ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
          }}>
            <FormControl sx={{ width: 180, marginRight: '5px', marginBottom: '10px' }}>
              <TextField
                size="small"
                value={_mainContext.checkMillisSeconds}
                onChange={handleChangeCheckMillisSeconds}
                label="下一次请求间隔时间（毫秒）"
              />
            </FormControl>
            <FormControl sx={{
              width: 200,
              marginRight: '5px',
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '20px'
            }}>
              不显示url
              <Switch
                size="small"
                checked={_mainContext.showUrl}
                onChange={handleChangeShowUrl}
                inputProps={{ 'aria-label': 'controlled' }}
              />显示url
            </FormControl>
            <FormControl sx={{ width: 180, marginRight: '5px', marginBottom: '10px' }}>
              <TextField
                size="small"
                value={_mainContext.httpRequestTimeout}
                onChange={handleChangeHttpRequestTimeout}
                label="请求超时时间（毫秒）"
              />
            </FormControl>
          </Box>
        ) : ''
      }
      {mod === 1 || mod === 2 ? (
        <FormControl sx={{ width: 550, margin: '10px' }}>
          <TextField multiline sx={{ fontSize: '11px' }} label={showTextAreaLable} size="small" id="standard-multiline-static" rows={4} value={_mainContext.exportDataStr} />
        </FormControl>
      ) : ''}
      {
        mod === 4 ? (
          <Box>
            <Sort></Sort>
            <Box>
              <FormControl sx={{
                width: 550,
                margin: '10px',
                display: 'flex',
                flexDirection: 'revert'
              }}>
                <LoadingButton
                  size="small"
                  onClick={doNextStep}
                  variant="outlined"
                  style={{ marginRight: '10px' }}
                  startIcon={<SkipNextIcon />}
                >
                  继续(下一步)
                </LoadingButton>
              </FormControl>
            </Box>
          </Box>
        ) : ''
      }
      {
        mod === 1 ? (
          <FormControl sx={{
            width: 550,
            margin: '10px',
            display: 'flex',
            flexDirection: 'revert'
          }}>
            <LoadingButton
              size="small"
              onClick={doBackward}
              variant="outlined"
              style={{ marginRight: '10px' }}
              startIcon={<SkipPreviousIcon />}
            >
              上一步
            </LoadingButton>
            <LoadingButton
              size="small"
              onClick={doDownload}
              variant="contained"
              style={{ marginRight: '10px' }}
              startIcon={<GetAppIcon />}
            >
              下载
            </LoadingButton>
            <LoadingButton
              size="small"
              onClick={doDoAgain}
              variant="contained"
              startIcon={<AutorenewIcon />}
            >
              再次处理
            </LoadingButton>
          </FormControl>
        ) : ''
      }
      {
        mod === 5 ? (
          <Box sx={{ width: 550, margin: '10px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={groupTab} onChange={handleChangeGroupTab} aria-label="basic tabs example">
                <Tab label="已有分组" />
                <Tab label="新增分组" />
              </Tabs>
            </Box>
            <TabPanel value={groupTab} index={0}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">更换分组</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedGroups}
                  label="更换分组"
                  onChange={handleChangeGroup}
                >
                  {_mainContext.uGroups.map((value, index) => (
                    <MenuItem key={index} value={value.key}>{value.key}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TabPanel>
            <TabPanel value={groupTab} index={1}>
              <FormControl fullWidth>
                <TextField id="standard-basic" label="输入新分组名称" value={customGroupName} 
                  variant="standard" onChange={changeCustomGroupName}/>
                </FormControl>
            </TabPanel>
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '5px'
            }}>
              <Button variant="outlined" onClick={doTransferGroup}>确定</Button>
            </Box>
          </Box>
        ) : ''
      }
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  mod: PropTypes.number.isRequired,
};