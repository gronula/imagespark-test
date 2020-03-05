<template lang="pug">
  #app
    header.header
      h1 Рейтинг участников

      .search
        label
          input(
            v-model="searchStr"
            type="search"
          )
          img(src="@/assets/search.svg" alt="Search")

    .rating-table
      header.rating-head
        .rating-cell
          h4 #
        .rating-cell
        .rating-cell
          h4 Имя
        .rating-cell
          h4(
            @click="tableHeadingClickHandler"
            data-id="rating"
          ) Баллы
        .rating-cell
          h4(
            @click="tableHeadingClickHandler"
            data-id="age"
          ) Возраст
      .rating-row(v-for="user, i in filteredUsers")
        .rating-cell {{ i + 1 }}
        .rating-cell
          .avatar {{ user.initials }}
        .rating-cell
          h4 {{ user.fullName }}
        .rating-cell
          b {{ user.rating }}
          small {{ user.ratingText }}
        .rating-cell
          b {{ user.age }}

</template>

<script>
export default {
  data() {
    return {
      users: [],
      sortType: "desc",
      searchStr: ""
    };
  },
  computed: {
    filteredUsers() {
      if (this.searchStr) {
        return this.users.filter(
          user =>
            user.fullName.toLowerCase().indexOf(this.searchStr.toLowerCase()) >
            -1
        );
      } else {
        return this.users;
      }
    }
  },
  methods: {
    sortFn(a, b) {
      if (a > b) {
        return this.sortType === "desc" ? -1 : 1;
      } else if (a < b) {
        return this.sortType === "desc" ? 1 : -1;
      } else {
        return a.name > b.name ? 1 : -1;
      }
    },
    getDeclension(number, txt, cases = [2, 0, 1, 1, 1, 2]) {
      return txt[
        number % 100 > 4 && number % 100 < 20
          ? 2
          : cases[number % 10 < 5 ? number % 10 : 5]
      ];
    },
    tableHeadingClickHandler(e) {
      const { id } = e.target.dataset;

      this.sortType = this.sortType === "desc" ? "asc" : "desc";

      this.users.sort((a, b) => this.sortFn(a[id], b[id]));
    }
  },
  async mounted() {
    await this.$store.dispatch("fetchData");

    this.users = this.$store.getters.users;
    this.users.forEach(user => {
      user.ratingText = this.getDeclension(user.rating, [
        "балл",
        "балла",
        "баллов"
      ]);

      user.initials = `${user.name
        .substr(0, 1)
        .toUpperCase()}${user.secondName.substr(0, 1).toUpperCase()}`;

      user.fullName = `${user.name} ${user.secondName}`;
    });
    this.users.sort((a, b) => this.sortFn(a.rating, b.rating));
  }
};
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  font-family: "Roboto", sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.search {
  display: flex;
  margin-left: 16px;

  label {
    display: flex;
    align-items: center;
  }

  input {
    width: 100%;
    margin-right: 16px;
    font-size: 1.3em;
    border: 0;
  }

  img {
    width: 32px;
    height: 32px;
  }
}

.rating-table {
  display: flex;
  flex-direction: column;
}

.rating-head,
.rating-row {
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 40px 80px auto 60px 80px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.rating-head {
  user-select: none;

  h4[data-id] {
    cursor: pointer;
  }
}

.rating-cell {
  display: flex;
  align-items: center;
  font-size: 1.2em;

  &:nth-of-type(1),
  &:nth-of-type(2),
  &:nth-of-type(5) {
    justify-content: center;
    text-align: center;
  }

  &:nth-of-type(4) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    text-align: right;
  }

  h4 {
    margin-top: 0;
    margin-bottom: 0;
  }
}

.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgb(81, 190, 176);
  color: #ffffff;

  .rating-row:nth-of-type(1) .rating-cell:nth-of-type(2) & {
    width: 70px;
    height: 70px;
    font-size: 1.6em;
    background-color: gold;
  }

  .rating-row:nth-of-type(2) .rating-cell:nth-of-type(2) & {
    width: 60px;
    height: 60px;
    font-size: 1.4em;
    background-color: silver;
  }

  .rating-row:nth-of-type(3) .rating-cell:nth-of-type(2) & {
    width: 50px;
    height: 50px;
    font-size: 1.2em;
    background-color: chocolate;
  }
}
</style>