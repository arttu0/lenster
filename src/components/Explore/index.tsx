import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import Footer from '@components/Shared/Footer';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import MetaTags from '@components/utils/MetaTags';
import { PublicationSortCriteria } from '@generated/types';
import { BirdStats } from '@lib/birdstats';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { APP_NAME } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Feed from './Feed';
import FeedType from './FeedType';

const Explore: NextPage = () => {
  const {
    query: { type }
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState(
    type && ['curated_profiles', 'top_commented', 'top_collected', 'top_mirrored'].includes(type as string)
      ? type.toString().toUpperCase()
      : PublicationSortCriteria.CuratedProfiles
  );

  useEffect(() => {
    BirdStats.track('Pageview', { path: PAGEVIEW.EXPLORE });
  }, []);

  return (
    <GridLayout>
      <MetaTags
        title={`Explore • ${APP_NAME}`}
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
      />
      <GridItemEight className="space-y-5">
        <FeedType setFeedType={setFeedType} feedType={feedType} />
        <Feed feedType={feedType as PublicationSortCriteria} />
      </GridItemEight>
      <GridItemFour>
        {isFeatureEnabled('trending-widget', currentProfile?.id) && <Trending />}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
