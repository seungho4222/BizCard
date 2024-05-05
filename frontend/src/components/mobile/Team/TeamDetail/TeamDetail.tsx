
import BackArrow from '@/components/shared/BackArrow'
import CardList from '@/components/shared/CardList'
import { CardType } from '@/types/cardType'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { pageChanged } from '@stores/team'
import AddCard from '@/components/mobile/MyAlbum/AddCard'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchTeamCardsList } from '@/apis/team'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Flex from '@/components/shared/Flex'
import LargeButton from '@/components/shared/LargeButton'
import Spacing from '@/components/shared/Spacing'
import Text from '@/components/shared/Text'
import { isLookingMemberState } from '@/stores/team';
import TeamMember from '@/components/mobile/Team/TeamDetail/TeamMember'
import { TeamListType } from '@/types/TeamListType'


const TeamDetail = () => {
  const isPageChanged = useRecoilValue(pageChanged)
  const [isAddCard, setIsAddCard] = useState(false)
  const {teamAlbumId} = useParams() 
  const teamInfo:TeamListType = useLocation().state
  console.log(teamInfo)
  const teamAlbumIdNumber = teamAlbumId ? +teamAlbumId : 0
  const navigate = useNavigate()
  const isLookingMember = useRecoilValue(isLookingMemberState)
  const hadnleAdd = () => {
    setIsAddCard(!isAddCard)
  }
  
  useEffect(() => {
    if (teamAlbumId === undefined) {
      alert('팀이 선택되지 않았습니다.')
      navigate(-1)
      return
    }
  })
  
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
    queryKey: ['fetchTeamCardsList'],
    queryFn: ({ pageParam = 0 }) => fetchTeamCardsList(teamAlbumIdNumber, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return Array.isArray(lastPage) && lastPage.length > 0
        ? allPages.length
        : undefined
    },
    initialPageParam: 0,
  })
  
  let teamCardList: CardType[] = data?.pages.flatMap(page => page.data_body) || []
  
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      )
        return
      if (hasNextPage) {
        fetchNextPage()
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchNextPage, hasNextPage, data])
  
  if (isAddCard) {
    return (
      <>

        <AddCard isAddCard={isAddCard} setIsAddCard={setIsAddCard} />
      </>
    )
  }
  
  if (!data || teamCardList.length === 0) {
    return (
      <>
      
      {!isPageChanged && <BackArrow />}
      <Flex direction='column' justify='center' align='center' style={{height:'100vh'}}>
        <Text>팀에 명함이 없습니다. </Text>
        <Text>명함을 추가해주세요. </Text>
        <Spacing size={20} direction='vertical'></Spacing>
        <LargeButton text='명함 추가' onClick={() => setIsAddCard(!isAddCard)} />
      </Flex>
      </>
    )
  }
  if (isLookingMember) {
    return <TeamMember team={teamInfo}/>
  }

  return (
    <>
      <div>
        {!isPageChanged && <BackArrow />}
        {teamCardList[0] !== undefined && teamCardList.length > 0 ?<CardList
          cards={teamCardList}
          isTeam={true}
          handleAdd={hadnleAdd}
        /> : <div>데이터가 없습니다.</div>}
      </div>
      {isAddCard && (
        <AddCard isAddCard={isAddCard} setIsAddCard={setIsAddCard} />
      )}

    </>
  )
}

export default TeamDetail
