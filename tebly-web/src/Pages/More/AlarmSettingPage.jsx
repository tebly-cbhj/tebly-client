import styled from 'styled-components';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import SettingToggleRow from '../../components/more/SettingToggleRow';
import { useAlarmSettingStore } from '../../store/AlarmSettingStore';
import { useNavigate } from 'react-router-dom';

const Content = styled.div`
  margin-top: 12px;
  width: 100%;
`;

export default function AlarmSettingPage() {
  const navigate = useNavigate();
  const {
    scheduleRemindAlarm, toggleScheduleRemindAlarm,
    pokingAlarm, togglePokingAlarm,
    roomInviteAlarm, toggleRoomInviteAlarm,
    appointmentInviteAlarm, toggleAppointmentInviteAlarm,
  } = useAlarmSettingStore();

  return (
    <PageWrapper>
      <Header
        title="알림 설정"
        leftIcon="back"
        onLeft={() => navigate(-1)}
      />
      <Content>
        <SettingToggleRow
            label="일정 리마인드 알림"
            isOn={scheduleRemindAlarm}
            onToggle={toggleScheduleRemindAlarm} // TODO: 알림 설정 API 연동
        />
        <SettingToggleRow
            label="콕 찌르기 알림"
            isOn={pokingAlarm}
            onToggle={togglePokingAlarm} // TODO: 알림 설정 API 연동
        />
        <SettingToggleRow
            label="방 초대장 알림"
            isOn={roomInviteAlarm}
            onToggle={toggleRoomInviteAlarm} // TODO: 알림 설정 API 연동
        />
        <SettingToggleRow
            label="약속 초대장 알림"
            isOn={appointmentInviteAlarm}
            onToggle={toggleAppointmentInviteAlarm} // TODO: 알림 설정 API 연동
        />
      </Content>
    </PageWrapper>
  );
}