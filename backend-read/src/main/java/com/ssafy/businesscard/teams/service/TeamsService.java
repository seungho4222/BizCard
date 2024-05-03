package com.ssafy.businesscard.teams.service;

import com.ssafy.businesscard.privateAlbum.dto.PrivateAlbumResponseDto;
import com.ssafy.businesscard.teams.dto.TeamListResponseDto;
import com.ssafy.businesscard.teams.dto.TeamMemberListResponseDto;

import java.util.List;

public interface TeamsService {
    public List<TeamListResponseDto> getTeamList(Long userId);
    public List<PrivateAlbumResponseDto> getTeamAlbumList(Long teamAlbumId, int page);
    public List<TeamMemberListResponseDto> getTeamMemberList(Long userId, Long teamAlbumId);
}
