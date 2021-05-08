Component({
  mixins: [],
  data: {
  },
  props: {
     onHidetest: (info)=>{},
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    lifeClose(){
      this.props.onHidetest({'close':0});
    }
  },
});
