import React, { useRef } from 'react'
import styled from 'styled-components'
import Slider, { Settings } from 'react-slick'

import { Participant as ParticipantType } from '../../types/user'
import { ChevronLeftIcon } from '../Icons/ChevronLeftIcon'
import { ChevronRightIcon } from '../Icons/ChevronRightIcon'
import { FlexBox } from '../Box/Box'
import { Participant } from './Participant'

const SliderWrapper = styled.div`
  margin: 0 -8px;

  .slick-dots li {
    top: -6px;
    margin: 0;
  }

  .slick-dots li button {
    width: 22px;
    height: 22px;

    &::before {
      display: none;
    }

    .slider-content {
      min-width: 185px;
    }

    .button-content {
      width: 10px;
      height: 10px;
      background: #ffffff;
      border: 1px solid #cdcdcd;
      border-radius: 50%;
    }
  }

  .slick-dots li.slick-active button {
    .button-content {
      background: #308575;
      border: 1px solid #308575;
    }
  }
`

const DotsContainer = styled(FlexBox)`
  position: absolute;
  top: -40px;
  right: 0;
  bottom: auto;
  width: auto;
`

const ArrowButton = styled.div`
  color: #6c6e6e;
  font-size: 24px;
  line-height: 24px;
  cursor: pointer;
`

const customPaging = (index: number): JSX.Element => {
  return (
    <button>
      <div className="button-content">{index + 1}</div>
    </button>
  )
}

const settings: Settings = {
  arrows: false,
  dots: true,
  infinite: false,
  centerMode: false,
  rows: 2,
  slidesPerRow: 6,
  customPaging,
  variableWidth: true,
  responsive: [
    {
      breakpoint: 1550,
      settings: {
        rows: 2,
        slidesPerRow: 6,
      },
    },
    {
      breakpoint: 1480,
      settings: {
        rows: 2,
        slidesPerRow: 5,
      },
    },
    {
      breakpoint: 1280,
      settings: {
        rows: 2,
        slidesPerRow: 5,
      },
    },
    {
      breakpoint: 1100,
      settings: {
        rows: 2,
        slidesPerRow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        rows: 2,
        slidesPerRow: 2,
      },
    },
  ],
}

type Props = {
  participants: ParticipantType[]
}

export const ParticipantsSlider = ({ participants }: Props) => {
  const sliderRef = useRef<Slider>(null)

  const nextSlide = () => {
    sliderRef.current?.slickNext()
  }

  const prevSlide = () => {
    sliderRef.current?.slickPrev()
  }

  const appendDots = (dots: React.ReactNode) => {
    return (
      <DotsContainer alignItems="center">
        <ArrowButton onClick={prevSlide}>
          <ChevronLeftIcon />
        </ArrowButton>
        <div>
          <ul>{dots}</ul>
        </div>
        <ArrowButton onClick={nextSlide}>
          <ChevronRightIcon />
        </ArrowButton>
      </DotsContainer>
    )
  }

  return (
    <SliderWrapper>
      <Slider {...settings} ref={sliderRef} appendDots={appendDots}>
        {participants.map((participant) => (
          <div className="slider-content">
            <Participant key={participant.id} participant={participant} />
          </div>
        ))}
      </Slider>
    </SliderWrapper>
  )
}
