import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../PageWrapper';
import Header from '../../components/common/Header';
import ProgressBar from '../../components/common/ProgressBar';
import CheckBoxRow from '../../components/common/CheckBoxRow';
import Btn from '../../components/common/Btn';
import TermsDetailOverlay from '../../components/onboarding/TermsDetailOverlay';
import AppTypo from '../../assets/onboarding/app-typo.svg?react';

import termsOfService from '../../content/termsOfService.md?raw';
import privacyPolicy from '../../content/privacyPolicy.md?raw';
import marketingConsent from '../../content/marketingConsent.md?raw';

const TERMS_DETAIL = {
  service: { title: '서비스 이용약관', content: termsOfService },
  privacy: { title: '개인정보 처리방침', content: privacyPolicy },
  marketing: { title: '마케팅 정보 수신 동의', content: marketingConsent },
};

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
`;

const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 12px;
`;

const Title = styled.p`
  ${({ theme }) => theme.typography.h2};
  color: #000;
  white-space: pre-line;
  margin: 0;
  margin-top: 8px;
`;

const CheckListWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 350px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-top: 32px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
`;

const BtnWrapper = styled.div`
  position: fixed;
  bottom: 21px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 350px;
`;

export default function TermsAgreementPage() {
  const navigate = useNavigate();
  const [allChecked, setAllChecked] = useState(false);
  const [terms, setTerms] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });
  const [openedTerm, setOpenedTerm] = useState(null);

  function handleAllCheck() {
    const next = !allChecked;
    setAllChecked(next);
    setTerms({
      service: next,
      privacy: next,
      marketing: next,
    });
  }

  function handleCheck(key) {
    const next = { ...terms, [key]: !terms[key] };
    setTerms(next);
    setAllChecked(next.service && next.privacy && next.marketing);
  }

  const canNext = terms.service && terms.privacy;

  return (
    <PageWrapper>
      <Header
        leftIcon="back"
        onLeft={() => navigate(-1)}
      />

      <ProgressWrapper>
        <ProgressBar step={1} total={3} />
      </ProgressWrapper>

      <ContentWrapper>
        <div style={{ marginTop: '32px' }}>
          <AppTypo width={95.001} height={36.678} />
        </div>

        <Title>{`환영합니다!\n아래 약관을 확인해주세요.`}</Title>

        <CheckListWrapper>
          <CheckBoxRow
            label="전체 동의"
            checked={allChecked}
            onChange={handleAllCheck}
            showChevron={false}
            bold={true}
          />

          <Divider />

          <CheckBoxRow
            label="[필수] 서비스 이용약관 동의"
            checked={terms.service}
            onChange={() => handleCheck('service')}
            onChevronClick={() => setOpenedTerm('service')}
          />
          <CheckBoxRow
            label="[필수] 개인정보 처리방침 동의"
            checked={terms.privacy}
            onChange={() => handleCheck('privacy')}
            onChevronClick={() => setOpenedTerm('privacy')}
          />
          <CheckBoxRow
            label="[선택] 마케팅 정보 수신 동의"
            checked={terms.marketing}
            onChange={() => handleCheck('marketing')}
            onChevronClick={() => setOpenedTerm('marketing')}
          />
        </CheckListWrapper>
      </ContentWrapper>

      <BtnWrapper>
        <Btn
          text="다음"
          disabled={!canNext}
          variant={canNext ? 'primary' : 'primary50'}
          onClick={() => navigate('/signup/profile')} // TODO: 다음 단계 이동
        />
      </BtnWrapper>

      {openedTerm && (
        <TermsDetailOverlay
          title={TERMS_DETAIL[openedTerm].title}
          content={TERMS_DETAIL[openedTerm].content}
          onClose={() => setOpenedTerm(null)}
        />
      )}
    </PageWrapper>
  );
}