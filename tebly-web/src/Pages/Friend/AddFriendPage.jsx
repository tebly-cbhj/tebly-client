import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DigitSlot from '../../components/friend/DigitSlot';
import CopyIcon from '../../assets/icons/copy.svg?react';
import { useFriendStore } from '../../store/FriendStore';
import Btn from '../../components/common/Btn';

const CODE_LENGTH = 6;

const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg};
  box-sizing: border-box;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 3.3125rem;
  padding: 1.125rem 1.625rem 0.875rem 1.6875rem;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  width: 64px;
  height: 32px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const HeaderCenter = styled.div`
  flex: 1;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderRight = styled.div`
  width: 64px;
  height: 32px;
`;

const BackBtn = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const PageTitle = styled.span`
  ${({ theme }) => theme.typography.h3};
  color: ${({ theme }) => theme.colors.gray900};
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 28px 20px 16px;
  gap: 16px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.div`
  width: 100%;
  padding: 20px 24px 24px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
`;

const CardLabel = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: -0.025rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

const CodeDisplay = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const MyCodeText = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: 0.0875rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

const CopyBtn = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const GuideText = styled.p`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray800};
  text-align: center;
  margin: 0;
  padding: 10px 0;
`;

const CodeSlots = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  cursor: text;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  border: none;
  outline: none;
  caret-color: transparent;
`;

const ErrorMessage = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.alert};
  text-align: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.25rem;
  background: rgba(26, 26, 26, 0.85);
  border-radius: 0.75rem;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 100;
`;

const BottomArea = styled.div`
  padding: 16px 20px;
  flex-shrink: 0;
`;

const ProfileCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 24px;
  gap: 0;
  box-sizing: border-box;
`;

const ProfileImgWrap = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FriendName = styled.span`
  ${({ theme }) => theme.typography.h2};
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: 8px;
`;

const FriendIntro = styled.span`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.colors.gray800};
  margin-bottom: 20px;
  text-align: center;
`;

const AddFriendBtn = styled.button`
  width: 100%;
  padding: 16px 10px;
  background: ${({ theme }) => theme.colors.primary100};
  border-radius: 16px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const AddFriendBtnText = styled.span`
  ${({ theme }) => theme.typography.h3};
  color: ${({ theme }) => theme.colors.white};
`;

export default function AddFriendPage() {
  const navigate = useNavigate();
  const addFriendByCode = useFriendStore((s) => s.addFriendByCode);
  const previewFriendByCode = useFriendStore((s) => s.previewFriendByCode);
  const inviteCode = useFriendStore((s) => s.inviteCode);
  const fetchInviteCode = useFriendStore((s) => s.fetchInviteCode);
  const friends = useFriendStore((s) => s.friends);
  const fetchFriends = useFriendStore((s) => s.fetchFriends);
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copyToast, setCopyToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [foundFriend, setFoundFriend] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchInviteCode();
    fetchFriends();
  }, [fetchInviteCode, fetchFriends]);

  function handleCodeChange(e) {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH);
    setCode(val);
    setIsError(false);
    setErrorMsg('');
    setFoundFriend(null);
  }

  function showError(msg) {
    setIsError(true);
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 2000);
  }

  function handleCopy() {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(inviteCode ?? '').catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  }

  function fallbackCopy() {
    const el = document.createElement('textarea');
    el.value = inviteCode ?? '';
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  async function handleSubmit() {
    if (code.length < CODE_LENGTH || isSubmitting) return;
    if (code === inviteCode) {
      showError('자신의 코드는 입력할 수 없어요');
      return;
    }
    setIsSubmitting(true);
    try {
      const friend = await previewFriendByCode(code);
      setFoundFriend(friend);
    } catch (err) {
      showError(err.response?.data?.message || '사용자를 찾을 수 없습니다');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddFriend() {
    if (!foundFriend || isAdding) return;
    setIsAdding(true);
    try {
      await addFriendByCode(code);
      navigate(-1);
    } catch (err) {
      showError(err.message || '친구 추가에 실패했어요');
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <>
    <Wrapper>
      <Header>
        <HeaderLeft>
          <BackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 20L7 12L17 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </BackBtn>
        </HeaderLeft>
        <HeaderCenter>
          <PageTitle>친구 추가</PageTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <ContentArea>
        <Card>
          <CardLabel>나의 코드</CardLabel>
          <CodeDisplay>
            <MyCodeText>{inviteCode ?? '-'}</MyCodeText>
            <CopyBtn type="button" onClick={handleCopy} aria-label="코드 복사">
              <CopyIcon />
            </CopyBtn>
          </CodeDisplay>
        </Card>

        <div>
          <GuideText>친구의 코드를 입력해 친구를 추가해요!</GuideText>
          <Card>
            <CardLabel>코드 입력</CardLabel>
            <CodeSlots onClick={() => inputRef.current?.focus()}>
              <HiddenInput
                ref={inputRef}
                value={code}
                onChange={handleCodeChange}
                maxLength={CODE_LENGTH}
                autoComplete="off"
                inputMode="numeric"
              />
              {Array.from({ length: CODE_LENGTH }, (_, i) => (
                <DigitSlot key={i} value={code[i] ?? ''} error={isError} />
              ))}
            </CodeSlots>
            <ErrorMessage $visible={!!errorMsg}>{errorMsg || ' '}</ErrorMessage>
          </Card>
        </div>

        {foundFriend && (
          <div style={{ marginTop: '1.5rem' }}>
            <ProfileCard>
              <ProfileImgWrap>
                {foundFriend.profileImageUrl ? (
                  <img src={foundFriend.profileImageUrl} alt={foundFriend.nickname} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="60" fill="#DCDCDC" />
                  </svg>
                )}
              </ProfileImgWrap>
              <FriendName>{foundFriend.nickname}</FriendName>
              {foundFriend.bio && <FriendIntro>{foundFriend.bio}</FriendIntro>}
              {friends.some((f) => f.id === foundFriend.id) ? (
                <AddFriendBtn disabled style={{ background: '#A3A3A3', cursor: 'default' }}>
                  <AddFriendBtnText>이미 친구예요</AddFriendBtnText>
                </AddFriendBtn>
              ) : (
                <AddFriendBtn onClick={handleAddFriend} disabled={isAdding}>
                  <AddFriendBtnText>{isAdding ? '추가하는 중...' : '친구 추가'}</AddFriendBtnText>
                </AddFriendBtn>
              )}
            </ProfileCard>
          </div>
        )}
      </ContentArea>

      <BottomArea>
        <Btn
          text={isSubmitting ? '조회하는 중...' : '입력 완료'}
          onClick={handleSubmit}
          disabled={code.length < CODE_LENGTH || isSubmitting}
          variant={code.length === CODE_LENGTH ? 'primary' : 'primary50'}
        />
      </BottomArea>

    </Wrapper>

    <Toast $visible={copyToast}>
      코드가 복사되었습니다. 친구에게 공유해보세요
    </Toast>

    </>
  );
}
