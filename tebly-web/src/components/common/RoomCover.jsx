import styled from 'styled-components';
import GalleryIcon from '../../assets/icons/gallery.svg?react';

const UploadButton = styled.button`
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gray200};
  display: flex;
  width: 350px;
  height: 176px;
  padding: 52px 0;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  position: relative;  
  overflow: hidden;    
`;

const Inner = styled.div`
  display: flex;
  width: 85px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray500};
`;

const StyledGalleryIcon = styled(GalleryIcon)`
  width: 44px;
  height: 44px;
  color: ${({ theme }) => theme.colors.gray500};
`;

// 사진이 있을 때 덮는 이미지
const CoverImage = styled.img`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 사진 위에 올라오는 "수정하기" 텍스트
const EditLabel = styled.span`
  position: absolute;
  bottom: 12px;
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.colors.gray100};
`;

export default function RoomCover({ imageUrl, onClick }) {
  return (
    <UploadButton onClick={onClick}>
      {imageUrl ? (
        // 사진 있을 때
        <>
          <CoverImage src={imageUrl} alt="방 커버" />
          <EditLabel>사진 수정하기</EditLabel>
        </>
      ) : (
        // 사진 없을 때 (기존 UI)
        <Inner>
          <StyledGalleryIcon />
          <Label>사진 추가하기</Label>
        </Inner>
      )}
    </UploadButton>
  );
}