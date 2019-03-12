// @flow

import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Creators as LocalPodcastsManagerCreators } from '~/store/ducks/localPodcastsManager';

import PodcastDetailComponent from './components/PodcastDetailComponent';
import { CustomAlert, TYPES } from '~/components/common/alert';
import CONSTANTS from '~/utils/CONSTANTS';

type Props = {
  podcastsDownloaded: Array<Object>,
  downloadPodcast: Function,
  removePodcast: Function,
  navigation: Object,
};

type State = {
  isPlaylistModalOpen: boolean,
};

class PodcastDetail extends Component<Props, State> {
  state = {
    isAddPlaylistModalOpen: false,
  };

  onToggleAddPlaylistModal = (): void => {
    const { isAddPlaylistModalOpen } = this.state;

    this.setState({
      isAddPlaylistModalOpen: !isAddPlaylistModalOpen,
    });
  };

  getProps = (): void => {
    const { navigation } = this.props;
    const { params } = navigation.state;

    const podcastInfo = params[CONSTANTS.PODCAST_DETAIL_PARAMS];

    return podcastInfo;
  };

  onNavigateAuthorDetail = (id: string): void => {
    const { navigation } = this.props;

    navigation.navigate(CONSTANTS.NAVIGATE_AUTHOR_DETAIL, {
      [CONSTANTS.AUTHOR_DETAIL_PARAMS]: {
        id,
      },
    });
  };

  onPressPlay = (): void => {
    const { navigation } = this.props;
    const podcast = this.getProps();

    navigation.navigate(CONSTANTS.NAVIGATE_PLAYER, {
      [CONSTANTS.PLAYER_PARAMS]: {
        [CONSTANTS.PLAYLIST_KEY]: [podcast],
      },
    });
  };

  onPressDownloadButton = (
    isPodcastDownloaded: boolean,
    id: string,
    url: string,
  ): void => {
    const { downloadPodcast, removePodcast } = this.props;

    const { action, type } = isPodcastDownloaded
      ? {
        action: () => removePodcast({ id }),
        type: TYPES.REMOVE_DOWNLOADED_PODCAST,
      }
      : {
        action: () => downloadPodcast({ id, url }),
        type: TYPES.DOWNLOAD_PODCAST,
      };

    CustomAlert(type, action);
  };

  checkPodcastDownloadStatus = (listKey: string, podcastId: string) => {
    const { localPodcastsManager } = this.props;

    const isPodcastOnTheList = localPodcastsManager[listKey].some((podcast) => {
      if (typeof podcast === 'object') {
        return podcast.id === podcastId;
      }

      return podcast === podcastId;
    });

    return isPodcastOnTheList;
  };

  render() {
    const { isAddPlaylistModalOpen } = this.state;

    const {
      description,
      uploadedAt,
      imageURL,
      subject,
      author,
      title,
      stars,
      url,
      id,
    } = this.getProps();

    const isPodcastDownloaded = this.checkPodcastDownloadStatus(
      'podcastsDownloaded',
      id,
    );

    const isDownloadingPodcast = this.checkPodcastDownloadStatus(
      'downloadingList',
      id,
    );

    return (
      <PodcastDetailComponent
        onPressDownloadButton={() => this.onPressDownloadButton(isPodcastDownloaded, id, url)
        }
        onNavigateAuthorDetail={() => this.onNavigateAuthorDetail(id)}
        onToggleAddPlaylistModal={this.onToggleAddPlaylistModal}
        isAddPlaylistModalOpen={isAddPlaylistModalOpen}
        isDownloadingPodcast={isDownloadingPodcast}
        isPodcastDownloaded={isPodcastDownloaded}
        onPressPlay={this.onPressPlay}
        description={description}
        uploadedAt={uploadedAt}
        imageURL={imageURL}
        subject={subject}
        author={author}
        title={title}
        stars={stars}
      />
    );
  }
}

const mapStateToProps = state => ({
  localPodcastsManager: state.localPodcastsManager,
});

const mapDispatchToProps = dispatch => bindActionCreators(LocalPodcastsManagerCreators, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PodcastDetail);