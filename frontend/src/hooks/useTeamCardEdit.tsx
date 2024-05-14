import { editTeamCard } from '@/apis/team'
import { selectedTeamAlbumIdState } from '@/stores/team'
import { cardInput } from '@/types/cardInput'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'

export const useTeamCardEdit = () => {
  const selectedAlbumId = useRecoilValue(selectedTeamAlbumIdState).teamAlbumId as number
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ['editTeamCard'],
    mutationFn: ({
      userId,
      teamAlbumId,
      cardId,
      data,
    }: {
      userId: number
      cardId: number
      teamAlbumId: number
      data: cardInput
    }) => editTeamCard({userId: userId, cardId: cardId, teamAlbumId: teamAlbumId, data: data }),
    onSuccess: () => {
      console.log('팀 카드 수정 성공')
      queryClient.invalidateQueries({ queryKey: ['fetchTeamCardsList', selectedAlbumId, 0] })
    },
    onError: error => {
      console.log('팀 카드 생성 실패', error, error.message)
      window.alert('팀 카드 생성에 실패했습니다. 다시 시도해주세요.')
    },
  })

  return mutation
}
